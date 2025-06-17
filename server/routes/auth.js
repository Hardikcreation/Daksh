const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//signup form
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = crypto.randomBytes(20).toString("hex");

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode,
    });

    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      // Configure your email service
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification from Daksh/Call Kaarigar",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Signup successful. Verification code sent to email." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

//email verify
router.post("/verify-email", async (req, res) => {
    const { email, verificationCode } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || user.verificationCode !== verificationCode) {
        return res.status(400).json({ message: "Invalid verification code." });
      }
  
      user.isVerified = true;
      user.verificationCode = undefined; // Clear the code
      await user.save();
  
      res.status(200).json({ message: "Email verified successfully." });
    } catch (err) {
      console.error("Verification Error:", err);
      res.status(500).json({ message: "Server error." });
    }
  });
  

  //login 

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || !user.isVerified) {
        return res.status(400).json({ message: "Email not verified or user does not exist." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });
  
      res.status(200).json({ token, user });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ message: "Server error." });
    }
  });