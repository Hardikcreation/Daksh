// models/HelpRequest.js
import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  issueType: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
export default HelpRequest;
