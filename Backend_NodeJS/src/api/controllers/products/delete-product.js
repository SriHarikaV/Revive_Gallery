const { Product } = require("../../../models/index.js");

module.exports = async (req, res) => {
  try {
    const { _id } = req.body;

    // Check if _id is provided
    if (!_id) {
      return res.status(400).json({ error: "_id is required for deletion" });
    }

    // Use findOneAndDelete to find and delete the product
    const deletedProduct = await Product.findOneAndDelete({ _id });

    // Check if the product exists
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error in deleting product:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
