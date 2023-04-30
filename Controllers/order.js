import Order from '../Models/order';

export const createOrder = async (req, res) => {
  try {
    const { userId, items, amount } = req.body;

    const newOrder = new Order({
      user: userId,
      items,
      amount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order created successfully.', order: savedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
