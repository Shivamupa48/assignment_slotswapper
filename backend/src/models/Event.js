const mongoose = require('mongoose');

const eventStatusEnum = ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'];

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(endTime) {
        return endTime > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  status: {
    type: String,
    enum: eventStatusEnum,
    default: 'BUSY',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
eventSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);

