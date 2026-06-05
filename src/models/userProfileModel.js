const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  businessName: {
    type: String,
    trim: true,
    default: "",
  },
  industry: {
    type: String,
    trim: true,
    default: "",
  },
  businessLogoUrl: {
    type: String,
    default: "/uploads/logos/default-placeholder.png",
  },
  notificationPreferences: {
    pushAlerts: { type: Boolean, default: true },
    emailDigest: { type: Boolean, default: false },
    smsAlerts: { type: Boolean, default: false },
  },
  quietHours: {
    enabled: { type: Boolean, default: false },
    startTime: { type: String, default: "22:00" },
    endTime: { type: String, default: "07:00" },
    applyToWeekends: { type: Boolean, default: true },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);
