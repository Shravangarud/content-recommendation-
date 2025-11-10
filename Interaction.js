const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  type: {
    type: String,
    enum: ['view', 'like', 'rating'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
interactionSchema.index({ userId: 1, contentId: 1, type: 1 });

module.exports = mongoose.model('Interaction', interactionSchema);
