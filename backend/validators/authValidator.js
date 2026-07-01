const { body } = require("express-validator");
const { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } = require("../utils/constants");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 50 }).withMessage("Name cannot exceed 50 characters"),

  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .matches(PASSWORD_REGEX)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required"),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

const verifyOtpValidator = [
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required"),

  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("Valid 6-digit OTP is required")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

const resendOtpValidator = [
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required"),
];

const forgotPasswordValidator = [
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required"),
];

const resetPasswordValidator = [
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required"),

  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("Valid 6-digit OTP is required")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),

  body("password")
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .matches(PASSWORD_REGEX)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
];

const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage("Name cannot exceed 50 characters"),

  body("phone")
    .optional()
    .trim()
    .notEmpty().withMessage("Phone number cannot be empty"),
];

module.exports = {
  registerValidator,
  loginValidator,
  verifyOtpValidator,
  resendOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
};
