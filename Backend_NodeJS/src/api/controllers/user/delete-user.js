const { User } = require("../../../models/index.js");

module.exports = async (req, res) => {
  try {
    const { email } = req.body;

    const { deletedCount } = await User.deleteOne({ email });
    if (deletedCount > 0) {
      return res.status(200).json({
        status: true,
      });
    } else {
      return res.status(401).json({
        error: "User Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
