  // config/keys.js
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'yoursecret',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpaySecret: process.env.RAZORPAY_KEY_SECRET,
  supportEmail: process.env.SUPPORT_EMAIL,
  supportEmailPass: process.env.SUPPORT_EMAIL_PASS,
};
