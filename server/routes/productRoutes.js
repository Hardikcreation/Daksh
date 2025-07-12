import express from "express";
import multer from "multer";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getPopularServices,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// 🗂️ Multer storage setup for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📁 Storing file:", file.originalname);
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname;
    console.log("📁 Generated filename:", filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("🔍 Checking file:", file.originalname, file.mimetype);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("❌ Multer error:", err);
    return res.status(400).json({ message: "File upload error", error: err.message });
  } else if (err) {
    console.error("❌ Other error:", err);
    return res.status(400).json({ message: err.message });
  }
  next();
};

// 🛠️ Routes
router.post("/", upload.fields([
  { name: "images", maxCount: 5 },
  { name: "subServiceImages", maxCount: 10 }
]), handleMulterError, createProduct); // Create with image upload
router.get("/", getAllProducts);                         // Get all
router.get("/popular", getPopularServices);              // Popular/latest
router.get("/:id", getProductById);                      // Get by ID
router.put("/:id", upload.fields([
  { name: "images", maxCount: 5 },
  { name: "subServiceImages", maxCount: 10 }
]), handleMulterError, updateProduct); // ✅ Update with image upload
router.delete("/:id", deleteProduct);                    // Delete

export default router;