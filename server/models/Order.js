import mongoose from "mongoose";

// Sub-service schema for additional services under each item
const subServiceSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
  },
  { _id: false }
);

// Feedback schema for both customer and partner feedback
const feedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      title: String,
      price: Number,
      imageUrl: String,
      quantity: {
        type: Number,
        default: 1,
      },
      subServices: [subServiceSchema],
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
    addressType: { type: String, enum: ["Home", "Office", "Other"], required: true },
    fullAddress: { type: String, required: true },
    timeSlot: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "processing", "Completed", "Cancelled", "Declined"],
    default: "Pending",
  },
  assignedPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
  requestStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Declined", "NoPartner","No service provider is available"],
    default: "Pending",
  },
  requestExpiresAt: { type: Date },
  
  rejectedPartners: {
    type: [mongoose.Schema.Types.ObjectId], // Use ObjectId for consistency
    default: []
  },
  startedAt: { type: Date, default: null }, // when partner starts the job
  completedAt: { type: Date, default: null }, // when job is marked complete

  // Codes for workflow (new fields)
  happyCode: { type: String },        // 4-digit code (shown to user, used by partner to start)
  completeCode: { type: String },     // 4-digit code (shown to user, used by partner to complete)

  // Feedback structure for both roles
  partnerFeedback: feedbackSchema,
  customerFeedback: feedbackSchema,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);