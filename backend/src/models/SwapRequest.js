const mongoose = require('mongoose');

const swapStatusEnum = ['PENDING', 'ACCEPTED', 'REJECTED'];

const swapRequestSchema = new mongoose.Schema({
  requesterSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  targetSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  requesterUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: swapStatusEnum,
    default: 'PENDING',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
swapRequestSchema.index({ requesterUserId: 1, status: 1 });
swapRequestSchema.index({ targetUserId: 1, status: 1 });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);

