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
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// 🛠️ Routes
router.post("/", upload.array("images"), createProduct); // Create with image upload
router.get("/", getAllProducts);                         // Get all
router.get("/popular", getPopularServices);              // Popular/latest
router.get("/:id", getProductById);                      // Get by ID
router.put("/:id", upload.array("images"), updateProduct); // ✅ Update with image upload
router.delete("/:id", deleteProduct);                    // Delete

export default router;
