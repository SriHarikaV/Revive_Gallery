import { User } from "../../../../models/index.js";

export default async (req, res) => {
  try {
    const data = req.body;

    const { email } = data;
    if (data?.password) {
      delete data.password;
    }
    let user = await User.findOneAndUpdate({ email }, { ...data });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: { ...data, email: user.email },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
