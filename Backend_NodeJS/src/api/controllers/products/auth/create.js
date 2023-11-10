const { Product } = require("../../../../models/index.js");
const { User } = require("../../../../models/index.js");
const { validateProduct } = require("../../../validators/product.validator.js");

module.exports = async (req, res) => {
  try {
    const productObj = req.body;
    console.log(productObj);
    const { error } = validateProduct(productObj);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Find the user by email
    const user = await User.findOne({ _id: productObj.owner }).exec();

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new product instance with the user reference
    let product = new Product({
      ...productObj,
      owner: user._id,
    });

    // Save the product to the database
    product = await product.save();

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Error in creating product:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
