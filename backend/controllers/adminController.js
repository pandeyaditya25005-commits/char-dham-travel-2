const User = require("../models/User");
const Admin = require("../models/Admin");
const Booking = require("../models/Booking");
const Contact = require("../models/Contact");
const TourPackage = require("../models/TourPackage");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const { sendBookingStatusUpdate } = require("../services/emailService");
const {
  getMonthlyRevenue,
  getRevenueByPackage,
  getRevenueByHotel,
  getBookingStatusDistribution,
  getPopularPackages,
  getUserRegistrationTrend,
  getBookingTrend,
  getBookingReport,
  getUserReport,
} = require("../services/reportService");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// ==================== DASHBOARD ====================

const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalUsers,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    totalPackages,
    totalHotels,
    totalRooms,
    unreadContacts,
    todayBookings,
    thisMonthBookings,
    activeAdmins,
  ] = await Promise.all([
    User.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "confirmed" }),
    Booking.countDocuments({ status: "cancelled" }),
    Booking.countDocuments({ status: "completed" }),
    TourPackage.countDocuments({ isActive: true }),
    Hotel.countDocuments({ isActive: true }),
    Room.countDocuments({ isActive: true }),
    Contact.countDocuments({ isRead: false }),
    Booking.countDocuments({ createdAt: { $gte: today } }),
    Booking.countDocuments({ createdAt: { $gte: thisMonth } }),
    Admin.countDocuments({ status: "active" }),
  ]);

  const revenueResult = await Booking.aggregate([
    { $match: { status: { $in: ["confirmed", "completed"] } } },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalAmount" },
        thisMonth: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", thisMonth] }, "$totalAmount", 0],
          },
        },
        today: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", today] }, "$totalAmount", 0],
          },
        },
      },
    },
  ]);

  const revenue = revenueResult[0] || { total: 0, thisMonth: 0, today: 0 };

  const recentBookings = await Booking.find()
    .populate("userId", "name email")
    .sort("-createdAt")
    .limit(5)
    .lean();

  const recentContacts = await Contact.find({ isRead: false })
    .sort("-createdAt")
    .limit(5)
    .lean();

  const statusDistribution = await getBookingStatusDistribution();

  res.json({
    success: true,
    stats: {
      users: { total: totalUsers, activeAdmins },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings,
        today: todayBookings,
        thisMonth: thisMonthBookings,
      },
      inventory: {
        packages: totalPackages,
        hotels: totalHotels,
        rooms: totalRooms,
      },
      revenue: {
        total: revenue.total,
        thisMonth: revenue.thisMonth,
        today: revenue.today,
      },
      contacts: { unread: unreadContacts },
    },
    statusDistribution,
    recentBookings,
    recentContacts,
  });
});

// ==================== USER MANAGEMENT ====================

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role, isVerified, sort = "-createdAt" } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  if (role) filter.role = role;
  if (isVerified !== undefined) filter.isVerified = isVerified === "true";

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort(sort)
    .lean();

  res.json({
    success: true,
    count: users.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    users,
  });
});

const getUserDetail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const adminProfile = await Admin.findOne({ userId: user._id }).lean();

  const bookingStats = await Booking.aggregate([
    { $match: { userId: user._id } },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        completedBookings: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
      },
    },
  ]);

  const recentBookings = await Booking.find({ userId: user._id })
    .populate("packageId", "title")
    .populate("hotelId", "name")
    .sort("-createdAt")
    .limit(5)
    .lean();

  res.json({
    success: true,
    user,
    adminProfile,
    bookingStats: bookingStats[0] || {
      totalBookings: 0,
      totalSpent: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      completedBookings: 0,
    },
    recentBookings,
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    throw new AppError("Invalid role. Must be user or admin.", 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", 404);

  if (role === "admin") {
    const existingAdmin = await Admin.findOne({ userId: user._id });
    if (!existingAdmin) {
      await Admin.create({
        userId: user._id,
        addedBy: req.user._id,
      });
    }
  } else {
    await Admin.deleteOne({ userId: user._id });
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: `User role updated to ${role}`,
    user: user.toPublicJSON(),
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new AppError("You cannot delete your own account", 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", 404);

  const activeBookings = await Booking.countDocuments({
    userId: user._id,
    status: { $in: ["pending", "confirmed"] },
  });
  if (activeBookings > 0) {
    throw new AppError(
      `Cannot delete user. They have ${activeBookings} active booking(s). Cancel them first.`,
      400
    );
  }

  await Booking.updateMany({ userId: user._id }, { status: "cancelled" });
  await Admin.deleteOne({ userId: user._id });
  await User.deleteOne({ _id: user._id });

  res.json({
    success: true,
    message: "User and associated data deleted successfully",
  });
});

const getUserBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { userId: req.params.id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Booking.countDocuments(filter);

  const bookings = await Booking.find(filter)
    .populate("packageId", "title slug")
    .populate("hotelId", "name location")
    .populate("roomId", "type")
    .skip(skip)
    .limit(Number(limit))
    .sort("-createdAt")
    .lean();

  res.json({
    success: true,
    count: bookings.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    bookings,
  });
});

// ==================== PACKAGE MANAGEMENT ====================

const createPackage = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.create(req.body);
  res.status(201).json({ success: true, package: pkg });
});

const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pkg) throw new AppError("Package not found", 404);
  res.json({ success: true, package: pkg });
});

const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!pkg) throw new AppError("Package not found", 404);
  res.json({ success: true, message: "Package deactivated successfully" });
});

const uploadPackageImages = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.findById(req.params.id);
  if (!pkg) throw new AppError("Package not found", 404);

  const images = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  pkg.images.push(...images);
  await pkg.save();

  res.json({
    success: true,
    message: `${images.length} image(s) uploaded`,
    images: pkg.images,
  });
});

// ==================== HOTEL MANAGEMENT ====================

const createHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.create(req.body);
  res.status(201).json({ success: true, hotel });
});

const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!hotel) throw new AppError("Hotel not found", 404);
  res.json({ success: true, hotel });
});

const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!hotel) throw new AppError("Hotel not found", 404);
  res.json({ success: true, message: "Hotel deactivated successfully" });
});

const createRoom = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) throw new AppError("Hotel not found", 404);

  const existingRoom = await Room.findOne({
    hotelId: req.params.hotelId,
    type: req.body.type,
  });
  if (existingRoom) {
    throw new AppError(`Room type "${req.body.type}" already exists for this hotel`, 400);
  }

  const room = await Room.create({
    ...req.body,
    hotelId: req.params.hotelId,
    availableRooms: req.body.totalRooms,
  });
  res.status(201).json({ success: true, room });
});

const getHotelRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ hotelId: req.params.hotelId }).sort("type");
  res.json({ success: true, rooms });
});

const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!room) throw new AppError("Room not found", 404);
  res.json({ success: true, room });
});

const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!room) throw new AppError("Room not found", 404);
  res.json({ success: true, message: "Room removed successfully" });
});

// ==================== BOOKING MANAGEMENT ====================

const getAllBookings = asyncHandler(async (req, res) => {
  const {
    status,
    type,
    fromDate,
    toDate,
    search,
    sort = "-createdAt",
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (fromDate || toDate) {
    filter.travelDate = {};
    if (fromDate) filter.travelDate.$gte = new Date(fromDate);
    if (toDate) filter.travelDate.$lte = new Date(toDate);
  }
  if (search) {
    filter.$or = [
      { bookingId: { $regex: search, $options: "i" } },
      { contactEmail: { $regex: search, $options: "i" } },
      { contactPhone: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Booking.countDocuments(filter);

  const bookings = await Booking.find(filter)
    .populate("userId", "name email phone")
    .populate("packageId", "title slug")
    .populate("hotelId", "name location")
    .populate("roomId", "type")
    .skip(skip)
    .limit(Number(limit))
    .sort(sort)
    .lean();

  res.json({
    success: true,
    count: bookings.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    bookings,
  });
});

const getBookingDetail = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("userId", "name email phone isVerified")
    .populate("packageId", "title slug description price duration difficulty images")
    .populate("hotelId", "name location description starRating images")
    .populate("roomId", "type price capacity amenities");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const userBookingCount = await Booking.countDocuments({
    userId: booking.userId._id,
  });

  res.json({
    success: true,
    booking,
    userBookingCount,
  });
});

const approveBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.status === "confirmed") {
    throw new AppError("Booking is already confirmed", 400);
  }
  if (booking.status === "cancelled") {
    throw new AppError("Cannot approve a cancelled booking", 400);
  }
  if (booking.status === "completed") {
    throw new AppError("Cannot approve a completed booking", 400);
  }

  booking.status = "confirmed";
  await booking.save();

  await sendBookingStatusUpdate(booking.contactEmail, booking);

  res.json({
    success: true,
    message: "Booking has been approved and confirmed.",
    booking,
  });
});

const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.status === "cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }
  if (booking.status === "completed") {
    throw new AppError("Cannot reject a completed booking", 400);
  }
  if (booking.status === "confirmed") {
    throw new AppError("Booking is already confirmed. Cancel it instead.", 400);
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

  if (booking.type === "package" && booking.packageId) {
    const pkg = await TourPackage.findById(booking.packageId);
    if (pkg && pkg.totalBookings > 0) {
      pkg.totalBookings -= 1;
      await pkg.save();
    }
  }

  booking.status = "cancelled";
  await booking.save();

  await sendBookingStatusUpdate(booking.contactEmail, booking);

  res.json({
    success: true,
    message: "Booking has been rejected and cancelled.",
    booking,
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError("Booking not found", 404);

  if (status === booking.status) {
    throw new AppError(`Booking is already ${status}`, 400);
  }
  if (booking.status === "cancelled") {
    throw new AppError("Cannot update a cancelled booking", 400);
  }

  if (status === "cancelled" && booking.type === "hotel" && booking.roomId) {
    const room = await Room.findById(booking.roomId);
    if (room) {
      room.availableRooms += booking.numberOfRooms || 1;
      if (room.availableRooms > room.totalRooms) {
        room.availableRooms = room.totalRooms;
      }
      await room.save();
    }
  }

  booking.status = status;
  await booking.save();

  try {
    await sendBookingStatusUpdate(booking.contactEmail, booking);
  } catch (err) {
    console.error("Status email failed:", err.message);
  }

  res.json({
    success: true,
    message: `Booking status updated to ${status}.`,
    booking,
  });
});

// ==================== CONTACT MANAGEMENT ====================

const getContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isRead, search } = req.query;
  const filter = {};
  if (isRead !== undefined) filter.isRead = isRead === "true";
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort("-createdAt")
    .lean();

  const unreadCount = await Contact.countDocuments({ isRead: false });

  res.json({
    success: true,
    count: contacts.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    unreadCount,
    contacts,
  });
});

const markContactRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true, repliedAt: new Date() },
    { new: true }
  );
  if (!contact) throw new AppError("Contact not found", 404);
  res.json({ success: true, message: "Contact marked as read", contact });
});

// ==================== REVENUE ANALYTICS ====================

const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;

  const [monthlyRevenue, revenueByPackage, revenueByHotel, statusDistribution] =
    await Promise.all([
      getMonthlyRevenue(Number(months)),
      getRevenueByPackage(),
      getRevenueByHotel(),
      getBookingStatusDistribution(),
    ]);

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalBookings = monthlyRevenue.reduce((sum, m) => sum + m.bookings, 0);

  res.json({
    success: true,
    analytics: {
      summary: {
        totalRevenue,
        totalBookings,
        averageOrderValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
        period: `${months} months`,
      },
      monthlyRevenue,
      revenueByPackage,
      revenueByHotel,
      statusDistribution,
    },
  });
});

const getRevenueMonthly = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;
  const data = await getMonthlyRevenue(Number(months));
  res.json({ success: true, data });
});

const getRevenueByPackages = asyncHandler(async (req, res) => {
  const data = await getRevenueByPackage();
  res.json({ success: true, data });
});

const getRevenueByHotels = asyncHandler(async (req, res) => {
  const data = await getRevenueByHotel();
  res.json({ success: true, data });
});

// ==================== REPORTS ====================

const getBookingsReport = asyncHandler(async (req, res) => {
  const { fromDate, toDate, status, type, page = 1, limit = 50 } = req.query;
  const report = await getBookingReport({ fromDate, toDate, status, type, page, limit });
  res.json({ success: true, ...report });
});

const getUsersReport = asyncHandler(async (req, res) => {
  const { fromDate, toDate, isVerified, page = 1, limit = 50 } = req.query;
  const report = await getUserReport({ fromDate, toDate, isVerified, page, limit });
  res.json({ success: true, ...report });
});

const getPopularPackagesReport = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const packages = await getPopularPackages(Number(limit));

  const totalPackageBookings = packages.reduce((sum, p) => sum + p.totalBookings, 0);

  res.json({
    success: true,
    count: packages.length,
    totalBookings: totalPackageBookings,
    packages,
  });
});

const getSummaryReport = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.query;

  const dateFilter = {};
  if (fromDate || toDate) {
    dateFilter.createdAt = {};
    if (fromDate) dateFilter.createdAt.$gte = new Date(fromDate);
    if (toDate) dateFilter.createdAt.$lte = new Date(toDate);
  }

  const [
    totalUsers,
    newUsers,
    totalBookings,
    totalRevenue,
    bookingTypeDistribution,
    avgBookingValue,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments(dateFilter),
    Booking.countDocuments(dateFilter),
    Booking.aggregate([
      { $match: { ...dateFilter, status: { $in: ["confirmed", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Booking.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $match: { ...dateFilter, status: { $in: ["confirmed", "completed"] } } },
      { $group: { _id: null, avg: { $avg: "$totalAmount" } } },
    ]),
  ]);

  res.json({
    success: true,
    summary: {
      period: {
        from: fromDate || "Beginning",
        to: toDate || "Present",
      },
      users: {
        total: totalUsers,
        new: newUsers,
      },
      bookings: {
        total: totalBookings,
        byType: bookingTypeDistribution,
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        averageOrderValue: avgBookingValue[0]?.avg || 0,
      },
    },
  });
});

const getTrends = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;

  const [userRegistrations, bookingTrends, popularPackages] = await Promise.all([
    getUserRegistrationTrend(Number(months)),
    getBookingTrend(Number(months)),
    getPopularPackages(5),
  ]);

  res.json({
    success: true,
    trends: {
      userRegistrations,
      bookingTrends,
      popularPackages,
    },
  });
});

module.exports = {
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
};
