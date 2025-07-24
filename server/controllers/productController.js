// File: server/controllers/productController.js

import Product from "../models/Product.js";
import Partner from "../models/Partner.js";

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    console.log("📥 Request files:", req.files);
    console.log("📥 Request headers:", req.headers);
    
    // Validate required fields
    if (!req.body.name) {
      console.log("❌ Missing name field");
      return res.status(400).json({ message: "Service name is required" });
    }
    
    if (!req.body.visitingPrice) {
      console.log("❌ Missing visitingPrice field");
      return res.status(400).json({ message: "Visiting price is required" });
    }
    
    // Handle main service images
    const mainImages = req.files && req.files.images ? req.files.images.map(file => file.filename) : [];
    console.log("📥 Main images:", mainImages);
    
    // Handle subservice images
    const subServiceImages = req.files && req.files.subServiceImages ? req.files.subServiceImages : [];
    console.log("📥 Subservice images:", subServiceImages);

    const parsedSubServices = req.body.subServices
      ? JSON.parse(req.body.subServices)
      : [];
    console.log("📥 Parsed subservices:", parsedSubServices);

    // Map subservice images to their corresponding subservices by name
    const updatedSubServices = parsedSubServices.map((subService) => {
      // Try to find a matching uploaded image by originalname (from frontend)
      const subServiceImage = subServiceImages.find(img =>
        img.originalname === subService.image // The frontend should send the original filename in subService.image
      );
      return {
        ...subService,
        image: subServiceImage ? subServiceImage.filename : subService.image || null
      };
    });
    console.log("📥 Updated subservices:", updatedSubServices);

    const newProduct = new Product({
      name: req.body.name,
      visitingPrice: Number(req.body.visitingPrice),
      images: mainImages,
      subServices: updatedSubServices,
    });

    console.log("📥 Created product object:", newProduct);

    await newProduct.save();
    console.log("✅ Product saved successfully");
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("❌ Error in createProduct:", err.message);
    console.error("❌ Full error:", err);
    res.status(500).json({ message: "Failed to create product", error: err.message });
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
    console.log("📥 Update Request body:", req.body);
    console.log("📥 Update Request files:", req.files);
    
    // Handle main service images
    const mainImages = req.files && req.files.images ? req.files.images.map(file => file.filename) : [];
    console.log("📥 Main images:", mainImages);
    
    // Handle subservice images
    const subServiceImages = req.files && req.files.subServiceImages ? req.files.subServiceImages : [];
    console.log("📥 Subservice images:", subServiceImages);

    const parsedSubServices = req.body.subServices
      ? JSON.parse(req.body.subServices)
      : [];
    console.log("📥 Parsed subservices:", parsedSubServices);

    // Map subservice images to their corresponding subservices by name
    const updatedSubServices = parsedSubServices.map((subService) => {
      // Try to find a matching uploaded image by originalname (from frontend)
      const subServiceImage = subServiceImages.find(img =>
        img.originalname === subService.image // The frontend should send the original filename in subService.image
      );
      return {
        ...subService,
        image: subServiceImage ? subServiceImage.filename : subService.image || null
      };
    });
    console.log("📥 Updated subservices:", updatedSubServices);

    const keptImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];

    const updatedData = {
      name: req.body.name,
      visitingPrice: Number(req.body.visitingPrice),
      subServices: updatedSubServices,
      images: [...keptImages, ...mainImages],
    };

    console.log("📥 Updated data:", updatedData);

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    console.error("❌ Error updating product:", err.message);
    console.error("❌ Full error:", err);
    res.status(500).json({ message: "Error updating product", error: err.message });
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