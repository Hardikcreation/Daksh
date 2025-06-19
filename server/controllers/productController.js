// File: server/controllers/productController.js

import Product from "../models/Product.js";
import Partner from "../models/Partner.js";

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const imageFilenames = req.files ? req.files.map(file => file.filename) : [];

    const parsedSubServices = req.body.subServices
      ? JSON.parse(req.body.subServices)
      : [];

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      rating: Number(req.body.rating),
      review: req.body.review,
      images: imageFilenames,
      subServices: parsedSubServices,
    });

    console.log("📥 Received subServices:", parsedSubServices);

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("❌ Error in createProduct:", err.message);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithAvailability = await Promise.all(
      products.map(async (product) => {
        const hasPartner = await Partner.exists({
          category: product.name,
          isApproved: true,
          isDeclined: false,
        });
        return {
          ...product.toObject(),
          partnerAvailable: !!hasPartner
        };
      })
    );

    res.status(200).json(productsWithAvailability);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product by ID:", err.message);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// ✅ Update Product (with existing image retention & subservices management)
export const updateProduct = async (req, res) => {
  try {
    const imageFilenames = req.files ? req.files.map(file => file.filename) : [];

    const parsedSubServices = req.body.subServices
      ? JSON.parse(req.body.subServices)
      : [];

    const keptImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];

    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      rating: Number(req.body.rating),
      review: req.body.review,
      subServices: parsedSubServices,
      images: [...keptImages, ...imageFilenames],
    };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    console.error("❌ Error updating product:", err.message);
    res.status(500).json({ message: "Error updating product" });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
    res.status(500).json({ message: "Error deleting product" });
  }
};

// ✅ Get Popular Services (Latest Products)
export const getPopularServices = async (req, res) => {
  try {
    const popular = await Product.find().sort({ createdAt: -1 }).limit(6);
    res.status(200).json(popular);
  } catch (err) {
    console.error("❌ Error loading popular services:", err.message);
    res.status(500).json({ message: "Failed to load popular services" });
  }
};
