const { body } = require("express-validator");

const createBookingValidator = [
  body("type")
    .isIn(["package", "hotel"])
    .withMessage("Booking type must be package or hotel"),

  body("travelDate")
    .isISO8601()
    .withMessage("Valid travel date is required (ISO 8601 format)"),

  body("endDate")
    .isISO8601()
    .withMessage("Valid end date is required (ISO 8601 format)"),

  body("numberOfPersons")
    .isInt({ min: 1, max: 50 })
    .withMessage("Number of persons must be between 1 and 50"),

  body("contactPhone")
    .trim()
    .notEmpty()
    .withMessage("Contact phone is required"),

  body("contactEmail")
    .trim()
    .isEmail()
    .withMessage("Valid contact email is required")
    .normalizeEmail(),

  body("packageId")
    .if(body("type").equals("package"))
    .isMongoId()
    .withMessage("Valid package ID is required for package bookings"),

  body("hotelId")
    .if(body("type").equals("hotel"))
    .isMongoId()
    .withMessage("Valid hotel ID is required for hotel bookings"),

  body("roomId")
    .if(body("type").equals("hotel"))
    .isMongoId()
    .withMessage("Valid room ID is required for hotel bookings"),

  body("numberOfRooms")
    .if(body("type").equals("hotel"))
    .isInt({ min: 1 })
    .withMessage("Number of rooms must be at least 1"),

  body("specialRequests")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Special requests cannot exceed 1000 characters"),
];

const updateBookingStatusValidator = [
  body("status")
    .isIn(["pending", "confirmed", "cancelled", "completed"])
    .withMessage("Status must be pending, confirmed, cancelled, or completed"),
];

module.exports = { createBookingValidator, updateBookingStatusValidator };
