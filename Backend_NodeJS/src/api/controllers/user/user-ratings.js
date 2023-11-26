// ratingController.js

const { User } = require("../../../models/index.js");

const addUserRating = async (req, res) => {
  try {
    const { userId, ratedUserId, rating } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Invalid rating value must be between 1 and 5." });
    }
    // Check if the user has already rated the target user
    const existingRating = user.ratings.find((r) => r.user.equals(ratedUserId));

    if (existingRating) {
      // If the user has already rated the target user, update the rating
      existingRating.rating = rating;
      existingRating.lastModified = new Date();
    } else {
      // If the user has not rated the target user, add a new rating
      user.ratings.push({
        user: ratedUserId,
        rating,
        lastModified: new Date(),
      });
    }

    await user.save();

    res.status(200).json({ message: "User rating added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteUserRating = async (req, res) => {
  try {
    const { userId, ratedUserId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the rating by the user ID
    const ratingIndex = user.ratings.findIndex((rating) =>
      rating.user.equals(ratedUserId)
    );

    if (ratingIndex === -1) {
      return res.status(404).json({ message: "User rating not found." });
    }

    // Remove the rating from the user's ratings array
    user.ratings.splice(ratingIndex, 1);

    await user.save();

    res.status(200).json({ message: "User rating deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  addUserRating,
  deleteUserRating,
};
