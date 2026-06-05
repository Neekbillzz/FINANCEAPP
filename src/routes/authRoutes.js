const express = require("express");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../middlewares/validationMiddleware");
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

router.post("/signup", registerValidation, registerUser);
router.post("verify-otp", verifyOTP);
router.post("/login", loginValidation, loginUser);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/reset-password", resetPasswordValidation, resetPassword);

module.exports = router;
