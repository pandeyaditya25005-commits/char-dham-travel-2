const Booking = require("../models/Booking");
const TourPackage = require("../models/TourPackage");
const Room = require("../models/Room");
const { sendBookingConfirmation } = require("../services/emailService");
const { loadInvoiceTemplate } = require("../services/invoiceService");
const generateBookingId = require("../utils/generateBookingId");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { BOOKING_CANCEL_HOURS } = require("../utils/constants");

const createBooking = asyncHandler(async (req, res) => {
  const {
    type,
    packageId,
    hotelId,
    roomId,
    travelDate,
    endDate,
    numberOfPersons,
    numberOfRooms,
    specialRequests,
    contactPhone,
    contactEmail,
  } = req.body;

  let totalAmount = 0;
  let packageDetails = null;
  let roomDetails = null;

  if (type === "package") {
    const pkg = await TourPackage.findById(packageId);
    if (!pkg) {
      throw new AppError("Tour package not found", 404);
    }
    if (!pkg.isActive) {
      throw new AppError("This tour package is currently not available", 400);
    }
    if (numberOfPersons > pkg.maxGroupSize) {
      throw new AppError(`Maximum group size for this package is ${pkg.maxGroupSize} persons`, 400);
    }

    totalAmount = pkg.price * numberOfPersons;
    pkg.totalBookings += 1;
    await pkg.save();
    packageDetails = { id: pkg._id, title: pkg.title, price: pkg.price };
  }

  if (type === "hotel") {
    if (!roomId) {
      throw new AppError("Room selection is required for hotel booking", 400);
    }

    roomDetails = await Room.findById(roomId).populate("hotelId", "name location");
    if (!roomDetails) {
      throw new AppError("Room not found", 404);
    }
    if (!roomDetails.isActive) {
      throw new AppError("This room type is currently not available", 400);
    }

    const requestedRooms = numberOfRooms || 1;
    if (roomDetails.availableRooms < requestedRooms) {
      throw new AppError(
        `Only ${roomDetails.availableRooms} room(s) available of this type`,
        400
      );
    }

    const nights = Math.max(
      1,
      Math.ceil((new Date(endDate) - new Date(travelDate)) / (1000 * 60 * 60 * 24))
    );
    totalAmount = roomDetails.price * requestedRooms * nights;

    roomDetails.availableRooms -= requestedRooms;
    await roomDetails.save();
  }

  if (totalAmount <= 0) {
    throw new AppError("Invalid booking amount", 400);
  }

  const booking = await Booking.create({
    bookingId: generateBookingId(),
    userId: req.user._id,
    type,
    packageId: type === "package" ? packageId : undefined,
    hotelId: type === "hotel" ? hotelId : undefined,
    roomId: type === "hotel" ? roomId : undefined,
    travelDate,
    endDate,
    numberOfPersons,
    numberOfRooms: type === "hotel" ? (numberOfRooms || 1) : undefined,
    totalAmount,
    specialRequests: specialRequests || "",
    contactPhone,
    contactEmail,
  });

  await sendBookingConfirmation(contactEmail, booking);

  res.status(201).json({
    success: true,
    message: `Your ${type === "package" ? "tour package" : "hotel"} booking has been created successfully. A confirmation email has been sent.`,
    booking,
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, type } = req.query;

  const filter = { userId: req.user._id };
  if (status) filter.status = status;
  if (type) filter.type = type;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Booking.countDocuments(filter);

  const bookings = await Booking.find(filter)
    .populate("packageId", "title slug images duration")
    .populate("hotelId", "name location")
    .populate("roomId", "type price")
    .skip(skip)
    .limit(Number(limit))
    .sort("-createdAt");

  res.json({
    success: true,
    count: bookings.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    bookings,
  });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("packageId", "title slug images price duration difficulty")
    .populate("hotelId", "name location images starRating")
    .populate("roomId", "type price capacity amenities")
    .populate("userId", "name email phone");

  if (!booking) {
    throw new AppError("Booking not found with the provided ID", 404);
  }

  if (
    booking.userId._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new AppError("You are not authorized to view this booking", 403);
  }

  res.json({ success: true, booking });
});

const getBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).select(
    "bookingId status type travelDate endDate totalAmount userId"
  );

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (
    booking.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Not authorized", 403);
  }

  res.json({
    success: true,
    status: booking.status,
    booking: {
      bookingId: booking.bookingId,
      type: booking.type,
      status: booking.status,
      travelDate: booking.travelDate,
      endDate: booking.endDate,
      totalAmount: booking.totalAmount,
    },
  });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.userId.toString() !== req.user._id.toString()) {
    throw new AppError("You can only cancel your own bookings", 403);
  }

  if (booking.status === "cancelled") {
    throw new AppError("This booking is already cancelled", 400);
  }

  if (booking.status === "completed") {
    throw new AppError("Cannot cancel a completed booking", 400);
  }

  const hoursUntilTravel =
    (new Date(booking.travelDate) - new Date()) / (1000 * 60 * 60);
  if (hoursUntilTravel < BOOKING_CANCEL_HOURS) {
    throw new AppError(
      `Bookings can only be cancelled at least ${BOOKING_CANCEL_HOURS} hours before the travel date. Please contact support for assistance.`,
      400
    );
  }

  if (booking.type === "hotel" && booking.roomId) {
    const room = await Room.findById(booking.roomId);
    if (room) {
      room.availableRooms += booking.numberOfRooms || 1;
      if (room.availableRooms > room.totalRooms) {
        room.availableRooms = room.totalRooms;
      }
      await room.save();
    }
  }

  booking.status = "cancelled";
  await booking.save();

  res.json({
    success: true,
    message: "Your booking has been cancelled successfully.",
    booking,
  });
});

const downloadInvoice = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("packageId", "title")
    .populate("hotelId", "name")
    .populate("roomId", "type");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (
    booking.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Not authorized to download this invoice", 403);
  }

  const invoiceHtml = loadInvoiceTemplate(booking);

  res.setHeader("Content-Type", "text/html");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="invoice-${booking.bookingId}.html"`
  );
  res.send(invoiceHtml);
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getBookingStatus,
  cancelBooking,
  downloadInvoice,
};
