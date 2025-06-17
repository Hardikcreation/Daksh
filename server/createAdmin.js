import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "./models/adminModel.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const existing = await Admin.findOne({ email: process.env.admin_Email });
  if (existing) {
    console.log("⚠️ Admin already exists");
    process.exit();
  }

  const admin = new Admin({
    name: "Super Admin",
    email: process.env.admin_Email,
    password: process.env.admin_password, // Will be hashed
  });

  await admin.save();
  console.log("✅ Admin created");
  process.exit();
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
