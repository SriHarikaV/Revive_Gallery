const { User } = require("../../../../models/index.js");
const { validateRegister } = require("../../../validators/user.validator.js");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    const { email, password, firstName, lastName } = req.body;
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const exists = await User.exists({ email }).catch((err) => {
      return res.status(500).json({ req, error: err.message });
    });

    if (exists) return res.status(409).json({ error: "exists" });

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    user = await user.save().catch((err) => {
      return res.status(500).json({ error: err.message });
    });
    const userWithoutPassword = { ...user.toObject(), password: undefined };
    return res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error.message,
    });
  }
};
