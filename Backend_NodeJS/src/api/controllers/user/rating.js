// ratingController.js

const { User, Product } = require("../../../models/index.js");

const addRating = async (req, res) => {
  try {
    const { userId, productId, rating } = req.body;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: "User or product not found." });
    }

    // Check if the user has already rated the product
    const existingRating = product.ratings.find((r) => r.user.equals(userId));

    if (existingRating) {
      // If the user has already rated the product, update the rating
      existingRating.rating = rating;
      existingRating.lastModified = new Date();
    } else {
      // If the user has not rated the product, add a new rating
      product.ratings.push({ user: userId, rating, lastModified: new Date() });
    }

    await product.save();

    res.status(200).json({ message: "Rating added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
const deleteRating = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Find the rating by the user ID
    const ratingIndex = product.ratings.findIndex((rating) =>
      rating.user.equals(userId)
    );

    if (ratingIndex === -1) {
      return res.status(404).json({ message: "Rating not found." });
    }

    // Remove the rating from the product's ratings array
    product.ratings.splice(ratingIndex, 1);

    await product.save();

    res.status(200).json({ message: "Rating deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  addRating,
  deleteRating,
};
