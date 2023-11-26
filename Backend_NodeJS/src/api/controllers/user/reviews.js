// reviewController.js
const { User, Product } = require("../../../models/index.js");

const addReview = async (req, res) => {
  try {
    const { userId, productId, text } = req.body;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: "User or product not found." });
    }

    // Check if the user has already reviewed the product
    // const existingReview = product.reviews.find((r) => r.user.equals(userId));

    // if (existingReview) {
    //   // If the user has already reviewed the product, update the review text
    //   existingReview.text = text;
    // } else {
    //   // If the user has not reviewed the product, add a new review
    //   product.reviews.push({ user: userId, text });
    // }
    product.reviews.push({ user: userId, text, dateAdded: new Date() });

    await product.save();

    res.status(200).json({ message: "Review added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
const deleteReview = async (req, res) => {
  try {
    const { reviewId, productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Find the review by the review ID
    const reviewIndex = product.reviews.findIndex((review) =>
      review._id.equals(reviewId)
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Remove the review from the product's reviews array
    product.reviews.splice(reviewIndex, 1);

    await product.save();

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
module.exports = {
  addReview,
  deleteReview,
};
