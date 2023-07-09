import Product from "../Models/products";
import { v2 as cloudinary } from 'cloudinary';




cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});


// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, availability, stock } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);

    const newProduct = new Product({
      name,
      price,
      availability,
      stock,
      totalStock: stock,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { name, price, availability, newStock } = req.body;
    let updatedProductData = { name, price, availability };

    if (newStock) {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      updatedProductData.stock = parseInt(newStock, 10);
      updatedProductData.totalStock = product.totalStock + parseInt(newStock, 10);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedProductData.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } else if (req.body.image) {
      updatedProductData.image = JSON.parse(req.body.image);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedProductData, { new: true });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Sell a product
export const sellProduct = async (req, res) => {
  try {
    const { soldQuantity } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (soldQuantity > product.totalStock) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    product.totalStock -= soldQuantity;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
