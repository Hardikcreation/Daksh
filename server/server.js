import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from './utils/connectDB.js';

import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import helpRoutes from './routes/helpRoutes.js';

import cron from "node-cron";
import { autoReassignExpiredOrdersJob } from "./jobs/autoReassignExpiredOrders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// For ES modules __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS allowed origins - use actual domain/subdomain names
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://daksh-client.onrender.com',
'https://daksh-admin.onrender.com',
  'https://daksh.smartbhopal.city',
  'https://admin8359dakshkarigar.smartbhopal.city'
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect DB
connectDB();

// ✅ Static upload path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/help', helpRoutes);

// ✅ Default API check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ CRON JOB: Reassign expired orders every 30 seconds
cron.schedule("*/30 * * * * *", async () => {
  await autoReassignExpiredOrdersJob();
});

// ✅ Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
