const { User, Product } = require("../../../models/index.js");

const addProductToWishList = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) {
      return res.status(404).json({ message: "User or product not found." });
    }

    // Add the product to the user's wishlist
    user.wishlist.push(product);
    await user.save();

    res
      .status(200)
      .json({ message: "Product added to wishlist successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
const removeProductFromWishList = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if the user and product exist
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: "User or product not found." });
    }

    // Check if the product is in the user's wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product not in wishlist." });
    }

    // Remove the product from the user's wishlist
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res
      .status(200)
      .json({ message: "Product removed from wishlist successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getUsersWishList = async (req, res) => {
  try {
    const userId = req.query.userId;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Populate the wishlist with product details
    const wishlistProducts = await Product.find({
      _id: { $in: user.wishlist },
    }).populate({
      path: "owner",
      select: "_id email firstName lastName",
    });

    res.status(200).json({ wishlist: wishlistProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
module.exports = {
  addProductToWishList,
  removeProductFromWishList,
  getUsersWishList,
};
