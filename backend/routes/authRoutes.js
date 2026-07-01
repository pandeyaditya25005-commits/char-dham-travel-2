const express = require("express");
const router = express.Router();
const {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../utils/validate");
const {
  registerValidator,
  loginValidator,
  verifyOtpValidator,
  resendOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
} = require("../validators/authValidator");

router.post("/register", registerValidator, validate, register);
router.post("/verify-otp", verifyOtpValidator, validate, verifyOtp);
router.post("/resend-otp", resendOtpValidator, validate, resendOtp);
router.post("/login", loginValidator, validate, login);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileValidator, validate, updateProfile);

module.exports = router;
