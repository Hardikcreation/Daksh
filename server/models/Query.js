// models/Query.js
const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  type: { type: String, enum: ['user', 'partner'], required: true },
  name: String,
  email: String,
  subject: String,
  message: String,
  status: { type: String, enum: ['solved', 'unsolved'], default: 'unsolved' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Query', querySchema);
