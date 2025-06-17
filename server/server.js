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
import bodyParser from 'body-parser';
import cron from "node-cron";
import { autoReassignExpiredOrdersJob } from "./jobs/autoReassignExpiredOrders.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// For ES modules __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'http://82.29.165.206:4173',
  'http://82.29.165.206:4174',
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// Avoid duplicate partnerRoutes mounting
// app.use("/api/partners", partnerRoutes);
// app.use("/api", partnerRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// ===== CRON JOB FOR AUTO REASSIGNMENT OF EXPIRED PARTNER REQUESTS =====
cron.schedule("*/30 * * * * *", async () => {
  await autoReassignExpiredOrdersJob();
});
// Start server
app.listen(8080, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:8080');
});