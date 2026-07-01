const { body, query } = require("express-validator");
const { BOOKING_STATUSES, USER_ROLES } = require("../utils/constants");

const updateUserRoleValidator = [
  body("role")
    .isIn(USER_ROLES)
    .withMessage(`Role must be one of: ${USER_ROLES.join(", ")}`),
];

const createPackageValidator = [
  body("title").trim().notEmpty().withMessage("Package title is required"),
  body("slug").trim().notEmpty().withMessage("Slug is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("duration").isInt({ min: 1, max: 30 }).withMessage("Duration must be 1-30 days"),
  body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
  body("maxGroupSize").optional().isInt({ min: 1 }).withMessage("Group size must be at least 1"),
  body("difficulty")
    .optional()
    .isIn(["easy", "moderate", "challenging"])
    .withMessage("Difficulty must be easy, moderate, or challenging"),
];

const createHotelValidator = [
  body("name").trim().notEmpty().withMessage("Hotel name is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("starRating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Star rating must be 1-5"),
];

const createRoomValidator = [
  body("type")
    .isIn(["single", "double", "deluxe", "suite"])
    .withMessage("Room type must be single, double, deluxe, or suite"),
  body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
  body("capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
  body("totalRooms").isInt({ min: 1 }).withMessage("Total rooms must be at least 1"),
];

const updateBookingStatusValidator = [
  body("status")
    .isIn(BOOKING_STATUSES)
    .withMessage(`Status must be one of: ${BOOKING_STATUSES.join(", ")}`),
];

const dateRangeValidator = [
  query("fromDate").optional().isISO8601().withMessage("Invalid fromDate format"),
  query("toDate").optional().isISO8601().withMessage("Invalid toDate format"),
];

module.exports = {
  updateUserRoleValidator,
  createPackageValidator,
  createHotelValidator,
  createRoomValidator,
  updateBookingStatusValidator,
  dateRangeValidator,
};
