const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../utils/validate");
const {
  updateUserRoleValidator,
  createPackageValidator,
  createHotelValidator,
  createRoomValidator,
  updateBookingStatusValidator,
  dateRangeValidator,
} = require("../validators/adminValidator");

const {
  getDashboardStats,
  getAllUsers,
  getUserDetail,
  updateUserRole,
  deleteUser,
  getUserBookings,
  createPackage,
  updatePackage,
  deletePackage,
  uploadPackageImages,
  createHotel,
  updateHotel,
  deleteHotel,
  createRoom,
  getHotelRooms,
  updateRoom,
  deleteRoom,
  getAllBookings,
  getBookingDetail,
  approveBooking,
  rejectBooking,
  updateBookingStatus,
  getContacts,
  markContactRead,
  getRevenueAnalytics,
  getRevenueMonthly,
  getRevenueByPackages,
  getRevenueByHotels,
  getBookingsReport,
  getUsersReport,
  getPopularPackagesReport,
  getSummaryReport,
  getTrends,
} = require("../controllers/adminController");

router.use(protect, adminOnly);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetail);
router.put("/users/:id/role", updateUserRoleValidator, validate, updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/users/:id/bookings", getUserBookings);

// Package Management
router.post("/packages", createPackageValidator, validate, createPackage);
router.put("/packages/:id", updatePackage);
router.delete("/packages/:id", deletePackage);
router.post("/packages/:id/images", upload.array("images", 5), uploadPackageImages);

// Hotel Management
router.post("/hotels", createHotelValidator, validate, createHotel);
router.put("/hotels/:id", updateHotel);
router.delete("/hotels/:id", deleteHotel);
router.post("/hotels/:hotelId/rooms", createRoomValidator, validate, createRoom);
router.get("/hotels/:hotelId/rooms", getHotelRooms);
router.put("/rooms/:id", updateRoom);
router.delete("/rooms/:id", deleteRoom);

// Booking Management
router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getBookingDetail);
router.put("/bookings/:id/approve", approveBooking);
router.put("/bookings/:id/reject", rejectBooking);
router.put(
  "/bookings/:id/status",
  updateBookingStatusValidator,
  validate,
  updateBookingStatus
);

// Contact Management
router.get("/contacts", getContacts);
router.put("/contacts/:id/read", markContactRead);

// Revenue Analytics
router.get("/analytics/revenue", getRevenueAnalytics);
router.get("/analytics/revenue/monthly", getRevenueMonthly);
router.get("/analytics/revenue/packages", getRevenueByPackages);
router.get("/analytics/revenue/hotels", getRevenueByHotels);

// Reports
router.get("/reports/bookings", dateRangeValidator, validate, getBookingsReport);
router.get("/reports/users", dateRangeValidator, validate, getUsersReport);
router.get("/reports/popular-packages", getPopularPackagesReport);
router.get("/reports/summary", dateRangeValidator, validate, getSummaryReport);
router.get("/reports/trends", getTrends);

module.exports = router;
