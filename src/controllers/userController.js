const User = require('../models/userModel');

exports.updateSettings = async (req, res) => {
  try {
    // 1. Verify we have a user
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 2. Log what we are trying to update
    console.log("Updating settings for User:", req.user.id);
    console.log("Payload:", req.body);

    // 3. Update the user
    // Make sure 'settings' is a field in your User model
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { settings: req.body } },
      { new: true, runValidators: true },
    );

    res.status(200).json(updatedUser.settings);
  } catch (err) {
    // 4. THIS LOG IS THE KEY TO FIXING YOUR BUG
    console.error("DETAILED ERROR:", err);
    res
      .status(500)
      .json({ message: "Error updating settings: " + err.message });
  }
};
