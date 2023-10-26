const bcrypt = require("bcrypt");
const { User } = require("../../../../models/index.js");

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials Email" });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials Password" });
    }

    // Password is valid, you can generate a token or do other authentication tasks here
    const userWithoutPassword = { ...user.toObject(), password: undefined };

    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
