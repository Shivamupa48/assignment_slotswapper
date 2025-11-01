const express = require('express');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const authenticate = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/swap/swappable-slots
// @desc    Get all swappable slots from other users
// @access  Private
router.get('/swappable-slots', async (req, res) => {
  try {
    // Find all events with status SWAPPABLE that don't belong to current user
    const slots = await Event.find({
      status: 'SWAPPABLE',
      userId: { $ne: req.user._id } // Not equal to current user
    })
      .populate('userId', 'name email') // Include user info
      .sort({ startTime: 1 });

    res.json({ slots });
  } catch (error) {
    console.error('Get swappable slots error:', error);
    res.status(500).json({ 
      message: 'Server error fetching swappable slots.', 
      error: error.message 
    });
  }
});

// @route   POST /api/swap/swap-request
// @desc    Create a swap request
// @access  Private
router.post('/swap-request', async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    // Validation
    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ 
        message: 'Please provide both mySlotId and theirSlotId.' 
      });
    }

    // Get both slots
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    // Verify slots exist
    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: 'One or both slots not found.' });
    }

    // Verify mySlot belongs to current user
    if (mySlot.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You can only swap your own slots.' 
      });
    }

    // Verify both slots are SWAPPABLE
    if (mySlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ 
        message: 'Your slot must be SWAPPABLE to create a swap request.' 
      });
    }

    if (theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ 
        message: 'Target slot is not available for swapping.' 
      });
    }

    // Verify user is not trying to swap with themselves
    if (mySlot.userId.toString() === theirSlot.userId.toString()) {
      return res.status(400).json({ 
        message: 'Cannot swap with yourself.' 
      });
    }

    // Create swap request
    const swapRequest = await SwapRequest.create({
      requesterSlotId: mySlotId,
      targetSlotId: theirSlotId,
      requesterUserId: req.user._id,
      targetUserId: theirSlot.userId,
      status: 'PENDING'
    });

    // Update both slots to SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    // Populate the swap request with slot and user details
    await swapRequest.populate('requesterSlotId targetSlotId requesterUserId targetUserId', 
      'title startTime endTime name email');

    res.status(201).json({
      message: 'Swap request created successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ 
      message: 'Server error creating swap request.', 
      error: error.message 
    });
  }
});

// @route   GET /api/swap/swap-requests
// @desc    Get all swap requests (incoming and outgoing)
// @access  Private
router.get('/swap-requests', async (req, res) => {
  try {
    const incoming = await SwapRequest.find({
      targetUserId: req.user._id,
      status: 'PENDING'
    })
      .populate('requesterSlotId', 'title startTime endTime')
      .populate('targetSlotId', 'title startTime endTime')
      .populate('requesterUserId', 'name email')
      .sort({ createdAt: -1 });

    const outgoing = await SwapRequest.find({
      requesterUserId: req.user._id
    })
      .populate('requesterSlotId', 'title startTime endTime')
      .populate('targetSlotId', 'title startTime endTime')
      .populate('targetUserId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      incoming,
      outgoing
    });
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ 
      message: 'Server error fetching swap requests.', 
      error: error.message 
    });
  }
});

// @route   POST /api/swap/swap-response/:requestId
// @desc    Accept or reject a swap request
// @access  Private
router.post('/swap-response/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { accepted } = req.body;

    if (typeof accepted !== 'boolean') {
      return res.status(400).json({ 
        message: 'Please provide accepted (true/false) in request body.' 
      });
    }

    // Find swap request
    const swapRequest = await SwapRequest.findById(requestId)
      .populate('requesterSlotId targetSlotId');

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found.' });
    }

    // Verify user is the target (the one receiving the request)
    if (swapRequest.targetUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You can only respond to swap requests sent to you.' 
      });
    }

    // Verify request is still pending
    if (swapRequest.status !== 'PENDING') {
      return res.status(400).json({ 
        message: 'This swap request has already been processed.' 
      });
    }

    if (accepted) {
      // ACCEPT: Exchange the owners of the two slots
      const requesterSlot = await Event.findById(swapRequest.requesterSlotId._id);
      const targetSlot = await Event.findById(swapRequest.targetSlotId._id);

      // Verify slots still exist and are in SWAP_PENDING status
      if (!requesterSlot || !targetSlot) {
        return res.status(404).json({ 
          message: 'One or both slots no longer exist.' 
        });
      }

      if (requesterSlot.status !== 'SWAP_PENDING' || targetSlot.status !== 'SWAP_PENDING') {
        return res.status(400).json({ 
          message: 'Slot statuses are invalid for swap completion.' 
        });
      }

      // Exchange owners
      const tempUserId = requesterSlot.userId;
      requesterSlot.userId = targetSlot.userId;
      targetSlot.userId = tempUserId;

      // Set both slots back to BUSY
      requesterSlot.status = 'BUSY';
      targetSlot.status = 'BUSY';

      // Save both slots
      await requesterSlot.save();
      await targetSlot.save();

      // Update swap request status
      swapRequest.status = 'ACCEPTED';
      await swapRequest.save();

      res.json({
        message: 'Swap accepted successfully. Slots have been exchanged.',
        swapRequest
      });
    } else {
      // REJECT: Set both slots back to SWAPPABLE
      const requesterSlot = await Event.findById(swapRequest.requesterSlotId._id);
      const targetSlot = await Event.findById(swapRequest.targetSlotId._id);

      if (requesterSlot && requesterSlot.status === 'SWAP_PENDING') {
        requesterSlot.status = 'SWAPPABLE';
        await requesterSlot.save();
      }

      if (targetSlot && targetSlot.status === 'SWAP_PENDING') {
        targetSlot.status = 'SWAPPABLE';
        await targetSlot.save();
      }

      // Update swap request status
      swapRequest.status = 'REJECTED';
      await swapRequest.save();

      res.json({
        message: 'Swap request rejected. Slots are available again.',
        swapRequest
      });
    }
  } catch (error) {
    console.error('Swap response error:', error);
    res.status(500).json({ 
      message: 'Server error processing swap response.', 
      error: error.message 
    });
  }
});

module.exports = router;

