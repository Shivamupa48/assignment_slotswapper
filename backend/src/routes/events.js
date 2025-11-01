const express = require('express');
const Event = require('../models/Event');
const authenticate = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/events
// @desc    Get all events for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id })
      .sort({ startTime: 1 }); // Sort by start time

    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ 
      message: 'Server error fetching events.', 
      error: error.message 
    });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, startTime, endTime, status } = req.body;

    // Validation
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'Please provide title, startTime, and endTime.' 
      });
    }

    // Create event
    const event = await Event.create({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: status || 'BUSY',
      userId: req.user._id
    });

    res.status(201).json({ 
      message: 'Event created successfully',
      event 
    });
  } catch (error) {
    console.error('Create event error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error.', 
        error: error.message 
      });
    }
    res.status(500).json({ 
      message: 'Server error creating event.', 
      error: error.message 
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, startTime, endTime, status } = req.body;
    
    // Find event and verify ownership
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You can only update your own events.' 
      });
    }

    // Update event
    if (title) event.title = title;
    if (startTime) event.startTime = new Date(startTime);
    if (endTime) event.endTime = new Date(endTime);
    if (status) event.status = status;

    await event.save();

    res.json({ 
      message: 'Event updated successfully',
      event 
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ 
      message: 'Server error updating event.', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Find event and verify ownership
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You can only delete your own events.' 
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ 
      message: 'Server error deleting event.', 
      error: error.message 
    });
  }
});

// @route   PUT /api/events/:id/status
// @desc    Update event status (e.g., make swappable)
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['BUSY', 'SWAPPABLE', 'SWAP_PENDING'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be BUSY, SWAPPABLE, or SWAP_PENDING.' 
      });
    }

    // Find event and verify ownership
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You can only update your own events.' 
      });
    }

    event.status = status;
    await event.save();

    res.json({ 
      message: 'Event status updated successfully',
      event 
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      message: 'Server error updating status.', 
      error: error.message 
    });
  }
});

module.exports = router;

