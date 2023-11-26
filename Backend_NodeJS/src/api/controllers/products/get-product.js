const { Product } = require("../../../models/index.js");

module.exports = async (req, res) => {
  try {
    console.log(req.query);
    const products = await Product.find(req.query)
      .populate({
        path: "owner",
        select: "_id email",
      })
      .populate({
        path: "reviews.user",
        select: "firstName lastName",
      })
      .populate({
        path: "ratings.user",
        select: "firstName lastName",
      });

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Error in fetching products:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
