// File: server/models/Product.js
import mongoose from "mongoose";

const subServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Sub-service name is required"],
    trim: true,
  },
  price: { type: Number, required: true },
  image: {
    type: String,
    default: null,
  },
  // Add other sub-service fields as needed, e.g., price, description
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    review: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        default: null,
      },
    ],
    subServices: [subServiceSchema],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster queries on name and createdAt
productSchema.index({ name: 1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model("Product", productSchema);