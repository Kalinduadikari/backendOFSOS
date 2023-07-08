import Order from "../Models/order";
import Product from "../Models/products";

export const createOrder = async (req, res) => {
  try {
    const { userId, items, amount, location, locationInput } = req.body;

    const newOrder = new Order({
      user: userId,
      items,
      amount,
      location,
      locationInput,
    });

    // Update totalStock and sales for each product in the order
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (item.quantity > product.totalStock) {
        return res.status(400).json({ error: "Not enough stock available" });
      }

      // Deduct quantity from totalStock and add to sales
      product.totalStock -= item.quantity;
      product.sales += item.quantity;
      await product.save();
    }

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully.", order: savedOrder });
  } catch (error) {
    console.error('Error in createOrder:', error); // add error handling
    res.status(500).json({ error: error.message });
  }
};


// New function to fetch orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.product').populate('user');
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({ error: error.message });
  }
};