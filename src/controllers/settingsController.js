const UserProfile = require("../models/userProfileModel");

exports.getProfileSettings = async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = await UserProfile.create({ userId: req.user.id });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProfileSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { businessName, industry, notificationPreferences, quietHours } =
      req.body;

    const updateFields = { updatedAt: Date.now() };
    if (businessName !== undefined) updateFields.businessName = businessName;
    if (industry !== undefined) updateFields.industry = industry;
    if (notificationPreferences !== undefined)
      updateFields.notificationPreferences = notificationPreferences;
    if (quietHours !== undefined) updateFields.quietHours = quietHours;

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Business profile options synced safely.",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.uploadBusinessLogo = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please attach a valid file asset." });
    }

    const logoUrlPath = `/uploads/logos/${req.file.filename}`;

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { businessLogoUrl: logoUrlPath } },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Business logo uploaded and applied successfully.",
      logoUrl: updatedProfile.businessLogoUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
