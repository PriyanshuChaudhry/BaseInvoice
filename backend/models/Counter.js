const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['quotation', 'proforma', 'invoice']
  },
  financialYear: {
    type: String,
    required: true
  },
  sequence: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure uniqueness per type and financial year
counterSchema.index({ type: 'type', financialYear: 1 }, { unique: true });

module.exports = mongoose.model('Counter', counterSchema);
