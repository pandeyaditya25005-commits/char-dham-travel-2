const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getBookingStatus,
  cancelBooking,
  downloadInvoice,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../utils/validate");
const { createBookingValidator } = require("../validators/bookingValidator");

router.post("/", protect, createBookingValidator, validate, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.get("/:id/status", protect, getBookingStatus);
router.get("/:id/invoice", protect, downloadInvoice);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
