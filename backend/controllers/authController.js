const User = require("../models/User");
const OTP = require("../models/OTP");
const { generateToken } = require("../services/tokenService");
const { sendOtpEmail } = require("../services/emailService");
const generateOtp = require("../utils/generateOtp");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { OTP_EXPIRY_MINUTES } = require("../utils/constants");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatar: user.avatar,
  isVerified: user.isVerified,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new AppError("Email already registered. Please login.", 400);
    }
    await User.deleteOne({ _id: existingUser._id });
    await OTP.deleteMany({ email });
  }

  const user = await User.create({ name, email, password, phone });

  await OTP.deleteMany({ email, type: "verify" });

  const otp = generateOtp();
  await OTP.create({
    email,
    otp,
    type: "verify",
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  await sendOtpEmail(email, otp, "verification");

  res.status(201).json({
    success: true,
    message: "Registration successful. A 6-digit OTP has been sent to your email.",
    email,
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found. Please register first.", 404);
  }

  if (user.isVerified) {
    throw new AppError("Email already verified. Please login.", 400);
  }

  const otpDoc = await OTP.findOne({ email, type: "verify" }).sort({ createdAt: -1 });
  if (!otpDoc) {
    throw new AppError("OTP has expired. Please request a new one.", 400);
  }

  const isValid = await otpDoc.compareOtp(otp);
  if (!isValid) {
    throw new AppError("Incorrect OTP. Please try again.", 400);
  }

  user.isVerified = true;
  await user.save();

  await OTP.deleteMany({ email, type: "verify" });

  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    message: "Email verified successfully. You can now login.",
    token,
    user: sanitizeUser(user),
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("No account found with this email.", 404);
  }

  if (user.isVerified) {
    throw new AppError("Email is already verified. Please login.", 400);
  }

  await OTP.deleteMany({ email, type: "verify" });

  const otp = generateOtp();
  await OTP.create({
    email,
    otp,
    type: "verify",
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  await sendOtpEmail(email, otp, "verification");

  res.json({
    success: true,
    message: "A new OTP has been sent to your email.",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email before logging in. Check your inbox for the OTP.", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    message: "Login successful.",
    token,
    user: sanitizeUser(user),
  });
});

const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully. Please discard your token on the client side.",
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;

  if (Object.keys(updates).length === 0) {
    throw new AppError("Nothing to update.", 400);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Profile updated successfully.",
    user: sanitizeUser(user),
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.json({
      success: true,
      message: "If an account with this email exists, a password reset OTP has been sent.",
    });
    return;
  }

  await OTP.deleteMany({ email, type: "reset" });

  const otp = generateOtp();
  await OTP.create({
    email,
    otp,
    type: "reset",
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  await sendOtpEmail(email, otp, "reset");

  res.json({
    success: true,
    message: "If an account with this email exists, a password reset OTP has been sent.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  const otpDoc = await OTP.findOne({ email, type: "reset" }).sort({ createdAt: -1 });
  if (!otpDoc) {
    throw new AppError("OTP has expired or is invalid. Please request a new one.", 400);
  }

  const isValid = await otpDoc.compareOtp(otp);
  if (!isValid) {
    throw new AppError("Incorrect OTP. Please try again.", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword) {
    throw new AppError("New password cannot be the same as the old password.", 400);
  }

  user.password = password;
  await user.save();

  await OTP.deleteMany({ email, type: "reset" });

  res.json({
    success: true,
    message: "Password has been reset successfully. You can now login with your new password.",
  });
});

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
};
