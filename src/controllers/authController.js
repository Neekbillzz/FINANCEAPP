const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    // 2. Generate a 6-digit random OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // 3. Save the user along with the OTP to MongoDB Atlas
    const user = await User.create({
      name,
      email,
      password, // Note: Remember to hash this with bcrypt later if you haven't!
      otp: generatedOtp,
      otpExpires: otpExpiryTime,
    });

    // 4. 🚀 THE MVP TRICK: Instead of emailing it, print it to your terminal!
    console.log("\n========================================");
    console.log(`📩 NEW SIGNUP REQUEST`);
    console.log(`User: ${name} (${email})`);
    console.log(`🔥 YOUR OTP CODE IS: ${generatedOtp}`);
    console.log("========================================\n");

    // 5. Respond back to your Next.js frontend successfully
    res.status(201).json({
      message:
        "Registration successful! Check your backend terminal for the OTP.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Find the user trying to verify
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Check if the OTP matches what's in the database
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // 3. Check if the code has been sitting too long (expired)
    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        message: "Verification code has expired. Please sign up again.",
      });
    }

    // 4. Update user to verified status and clear the temporary OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // 5. Send back a clean success response
    res.status(200).json({
      message: "Account verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Verification error details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password." });
    }

    res.status(200).json({
      token: generateToken(user._id),
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with that email address." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    console.log(`\n============== MOCK EMAIL FOR DEVELOPER ==============`);
    console.log(`User: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(
      `Next.js Client Link: http://localhost:3000/reset-password?token=${resetToken}`,
    );
    console.log(`======================================================\n`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: '"Nillaz Support" <no-reply@nillaz.com>',
      to: user.email,
      subject: "Nillaz Password Reset Request",
      text: `You requested a password reset. Click this link to complete it: ${resetUrl}`,
      html: `<p>You requested a password reset. Click the link below to change it:</p>
                   <a href="${resetUrl}" target="_blank">${resetUrl}</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        console.log(
          "Nodemailer active error (Check .env configuration):",
          err.message,
        );
      else console.log("Real email dispatched successfully:", info.response);
    });

    return res.status(200).json({
      message: "If that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  console.log("========================================");
  console.log(" ALERT: resetPassword route was successfully hit!");
  console.log(" Incoming Token from URL params:", req.params.token);
  console.log(" Incoming Body data:", req.body);
  console.log("========================================");
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset token is invalid or has expired." });
    }

    user.password = password;

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      message: "Password updated! You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
