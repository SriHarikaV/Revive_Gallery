const { User, Product } = require("../../../models/index.js");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: "User or product not found." });
    }

    // Check if the product is already in the user's cart
    const existingCartItem = user.cart.find((item) =>
      item.product.equals(productId)
    );

    if (existingCartItem) {
      // If the product is already in the cart, update the quantity
      existingCartItem.quantity = quantity;
    } else {
      // If the product is not in the cart, add it with the specified quantity
      user.cart.push({ product: productId, quantity: quantity });
    }

    await user.save();

    res.status(200).json({ message: "Product added to cart successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove the product from the user's cart
    user.cart = user.cart.filter((item) => !item.product.equals(productId));
    await user.save();

    res
      .status(200)
      .json({ message: "Product removed from cart successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.query.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Populate the cart with product details
    const cartProducts = await Promise.all(
      user.cart.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          product,
          quantity: item.quantity,
        };
      })
    );

    res.status(200).json({ cart: cartProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getUserCart,
};
