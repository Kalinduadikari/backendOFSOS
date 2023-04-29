import Cart from "../Models/cart";

// Get cart by user ID
// Get cart by user ID
export const getCartByUserId = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = {
        userId: req.params.userId,
        items: [],
      };
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, imageUrl, price, name } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const index = cart.items.findIndex((item) => item.productId.toString() === productId.toString());

    if (index !== -1) {
      cart.items[index].quantity += quantity;
      cart.items[index].image.url = imageUrl;
      cart.items[index].price = price;
      cart.items[index].name = name;
    } else {
      cart.items.push({ productId, quantity, image: { url: imageUrl }, price, name });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};







// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
