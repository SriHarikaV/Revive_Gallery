const { Product } = require("../../../../models/index.js");

module.exports = async (req, res) => {
  try {
    const data = req.body;
    const { _id } = data;
    delete data._id;
    console.log(data);

    // Use the { new: true } option to return the updated document
    let product = await Product.findOneAndUpdate(
      { _id },
      { ...data },
      { new: true }
    );

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Error in updating product:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
