const { User } = require("../../../models/index.js");

module.exports = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userWithoutPassword = { ...user.toObject(), password: undefined };

    return res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
