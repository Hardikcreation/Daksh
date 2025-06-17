import mongoose from "mongoose";
const subServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: {type: String, required: true},
  price:{type:  Number, required: true},
  rating: {type:  Number, required: true},
  review: {type: String, required: true},
  images: [String],
  subServices: [subServiceSchema]
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
