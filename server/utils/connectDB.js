import mongoose from 'mongoose';
import { config } from '../config/keys.js';

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);

  } 
};

export default connectDB; // ✅ Export as default


// geo location 
// feedback machenism for both service and customer 
// education details for service provider education API
// hosting 
// payment gateway 
// police verification 
// sos for both  service and customer

