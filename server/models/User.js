import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Address sub-schema
const addressSchema = new mongoose.Schema({
  houseNumber: { type: String, required: true },
  street: { type: String, required: true },
  landmark: { type: String },
  addressType: { type: String, enum: ["Home", "Office", "Other"], default: "Home" }
});


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
   resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  isAdmin: { type: Boolean, default: false },
   addresses: [addressSchema] 
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;