// ✅ partnerController.js (complete updated)
import Partner from '../models/Partner.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Order from '../models/Order.js';
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });
};

export const registerPartner = async (req, res) => {
  const { name, email, phone, password, category } = req.body;

  // Defensive: check required fields
  if (!name || !email || !phone || !password || !category) {
    return res.status(400).json({ message: 'All fields are required (name, email, phone, password, category).' });
  }

  try {
    const existingPartner = await Partner.findOne({ $or: [{ email }, { phone }] });
    if (existingPartner) return res.status(400).json({ message: 'Email or Phone already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const jobId = crypto.randomBytes(4).toString('hex');

    const partner = new Partner({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpires,
      jobId,
      category,
      isVerified: false, // typically false until email/otp is verified
      // personalDetails and documents will be added in later steps
    });

    await partner.save();
    await sendEmail(email, otp);
    res.status(201).json({ message: 'OTP sent to your email' });
  } catch (error) {
    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      const dupField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `Duplicate value for: ${dupField}` });
    }
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const partner = await Partner.findOne({ email });
    if (!partner) return res.status(400).json({ message: 'Partner not found' });
    if (partner.otp !== otp || partner.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    partner.isVerified = true;
    partner.otp = undefined;
    partner.otpExpires = undefined;
    await partner.save();

    const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('partner_token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Partner verified successfully', token, partner });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

export const loginPartner = async (req, res) => {
  // console.log("🔍 loginPartner controller called");

  const { email, password } = req.body;
  // console.log("📩 Received Email:", email);
  // console.log("🔐 Received Password:", password);

  try {
    const partner = await Partner.findOne({ email });
    if (!partner) {
      // console.log("❌ No partner found with email:", email);
      return res.status(404).json({ message: 'Partner not found' });
    }

    // console.log("✅ Partner found:", partner.email);
    // console.log("🗝️ Stored hashed password:", partner.password);

    if (!password || !partner.password) {
      // console.log("⚠️ One of the passwords is undefined");
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    // console.log("🔄 Password match result:", isMatch);

    if (!isMatch) {
      // console.log("❌ Passwords do not match");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // console.log("🔐 JWT generated:", token);

    res.status(200).json({ token, partner });
  } catch (err) {
    // console.error("🔥 Login Error:", err.message);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch partners' });
  }
};

export const deletePartner = async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Partner deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

export const getPartnerDashboardStats = async (req, res) => {
  try {
    const partnerId = req.partner._id;

    const totalOrders = await Order.countDocuments({ assignedPartner: partnerId });

    const completedOrders = await Order.countDocuments({
      assignedPartner: partnerId,
      completedAt: { $ne: null } // ✅ completed only if completedAt is set
    });

    const incompleteOrders = await Order.countDocuments({
      assignedPartner: partnerId,
      requestStatus: "Accepted",
      completedAt: null // ✅ still pending work
    });

    const earnings = await Order.aggregate([
      {
        $match: {
          assignedPartner: partnerId,
          completedAt: { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({
      totalOrders,
      completedOrders,
      incompleteOrders,
      earnings: earnings[0]?.total || 0,
    });
  } catch (err) {
    console.error("❌ Failed to fetch dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};


//forget Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const partner = await Partner.findOne({ email });
    if (!partner) return res.status(404).json({ message: "Partner not found" });
   
      // Prevent resend within 5 minutes
    if (partner.resetPasswordToken && partner.resetPasswordExpires > Date.now() - 5 * 60 * 1000) {
      return res.status(429).json({ message: "Please wait 5 minutes before requesting another reset link" });
    }

    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    partner.resetPasswordToken = hashedToken;
    partner.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await partner.save();

    const resetUrl = `http://82.29.165.206:8080/reset-password-partner/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: partner.email,
      subject: 'Partner Password Reset',
      html: `<p>Click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
    });

    res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    res.status(500).json({ message: "Error sending email" });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const partner = await Partner.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!partner) return res.status(400).json({ message: "Invalid or expired token" });

    partner.password = await bcrypt.hash(password, 10);
    partner.resetPasswordToken = undefined;
    partner.resetPasswordExpires = undefined;
    await partner.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.partnerId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const partner = await Partner.findById(req.partnerId);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.json({
      name: partner.name,
      jobId: partner._id,
      isVerified: partner.isVerified,
      category: partner.category,          // <-- Important: add this
      services: partner.services || [],
      email: partner.email,
    });
  } catch (err) {
    console.error("Error in /api/partners/me:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/partners/update-personal-details
export const updatePersonalDetails = async (req, res) => {
  try {
    // DEBUG: Log incoming data
    console.log("req.user:", req.user);
    console.log("req.partner:", req.partner);
    console.log("req.body:", req.body);

    // Adjust based on your middleware
    const partner = req.user || req.partner;
    if (!partner) return res.status(401).json({ message: "Not authorized" });

    // Validate required fields
    const requiredFields = ["fullName", "dob", "gender", "address", "phone", "email"];
    for (let key of requiredFields) {
      if (!req.body[key]) {
        return res.status(400).json({ message: `Missing field: ${key}` });
      }
    }

    // Update partner's personal details subdocument
    partner.personalDetails = {
      fullName: req.body.fullName,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
    };

    await partner.save();

    res.json({ message: "Personal details updated", partner });
  } catch (err) {
    console.error("updatePersonalDetails error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};