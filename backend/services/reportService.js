const Booking = require("../models/Booking");
const User = require("../models/User");
const TourPackage = require("../models/TourPackage");

const getMonthlyRevenue = async (months = 12) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const result = await Booking.aggregate([
    {
      $match: {
        status: { $in: ["confirmed", "completed"] },
        createdAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        revenue: 1,
        bookings: 1,
        label: {
          $concat: [
            {
              $arrayElemAt: [
                ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                "$_id.month",
              ],
            },
            " ",
            { $toString: "$_id.year" },
          ],
        },
      },
    },
  ]);

  return result;
};

const getRevenueByPackage = async () => {
  const result = await Booking.aggregate([
    { $match: { type: "package", status: { $in: ["confirmed", "completed"] } } },
    {
      $group: {
        _id: "$packageId",
        revenue: { $sum: "$totalAmount" },
        bookings: { $sum: 1 },
        persons: { $sum: "$numberOfPersons" },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $lookup: {
        from: "tourpackages",
        localField: "_id",
        foreignField: "_id",
        as: "package",
      },
    },
    { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        packageId: "$_id",
        packageTitle: "$package.title",
        revenue: 1,
        bookings: 1,
        persons: 1,
      },
    },
  ]);

  return result;
};

const getRevenueByHotel = async () => {
  const result = await Booking.aggregate([
    { $match: { type: "hotel", status: { $in: ["confirmed", "completed"] } } },
    {
      $group: {
        _id: "$hotelId",
        revenue: { $sum: "$totalAmount" },
        bookings: { $sum: 1 },
        rooms: { $sum: "$numberOfRooms" },
      },
    },
    { $sort: { revenue: -1 } },
    {
      $lookup: {
        from: "hotels",
        localField: "_id",
        foreignField: "_id",
        as: "hotel",
      },
    },
    { $unwind: { path: "$hotel", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        hotelId: "$_id",
        hotelName: "$hotel.name",
        hotelLocation: "$hotel.location",
        revenue: 1,
        bookings: 1,
        rooms: 1,
      },
    },
  ]);

  return result;
};

const getBookingStatusDistribution = async () => {
  const result = await Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
        totalAmount: 1,
      },
    },
  ]);

  return result;
};

const getPopularPackages = async (limit = 5) => {
  const result = await TourPackage.find({ isActive: true })
    .sort({ totalBookings: -1 })
    .limit(limit)
    .select("title slug price duration difficulty totalBookings images")
    .lean();

  return result;
};

const getUserRegistrationTrend = async (months = 12) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const result = await User.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        count: 1,
        label: {
          $concat: [
            {
              $arrayElemAt: [
                ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                "$_id.month",
              ],
            },
            " ",
            { $toString: "$_id.year" },
          ],
        },
      },
    },
  ]);

  return result;
};

const getBookingTrend = async (months = 12) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const result = await Booking.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        count: 1,
        revenue: 1,
        label: {
          $concat: [
            {
              $arrayElemAt: [
                ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                "$_id.month",
              ],
            },
            " ",
            { $toString: "$_id.year" },
          ],
        },
      },
    },
  ]);

  return result;
};

const getBookingReport = async ({ fromDate, toDate, status, type, page, limit }) => {
  const filter = {};
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate) filter.createdAt.$lte = new Date(toDate);
  }
  if (status) filter.status = status;
  if (type) filter.type = type;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Booking.countDocuments(filter);

  const bookings = await Booking.find(filter)
    .populate("userId", "name email phone")
    .populate("packageId", "title")
    .populate("hotelId", "name")
    .populate("roomId", "type")
    .skip(skip)
    .limit(Number(limit))
    .sort("-createdAt")
    .lean();

  const totals = await Booking.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
        totalPersons: { $sum: "$numberOfPersons" },
        avgAmount: { $avg: "$totalAmount" },
      },
    },
  ]);

  return {
    bookings,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    summary: totals[0] || { totalAmount: 0, totalPersons: 0, avgAmount: 0 },
  };
};

const getUserReport = async ({ fromDate, toDate, isVerified, page, limit }) => {
  const filter = {};
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate) filter.createdAt.$lte = new Date(toDate);
  }
  if (isVerified !== undefined) filter.isVerified = isVerified === "true";

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(filter);

  const users = await User.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort("-createdAt")
    .lean();

  const totals = await User.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        verified: { $sum: { $cond: ["$isVerified", 1, 0] } },
        unverified: { $sum: { $cond: ["$isVerified", 0, 1] } },
        admins: { $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] } },
      },
    },
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    summary: totals[0] || { verified: 0, unverified: 0, admins: 0 },
  };
};

module.exports = {
  getMonthlyRevenue,
  getRevenueByPackage,
  getRevenueByHotel,
  getBookingStatusDistribution,
  getPopularPackages,
  getUserRegistrationTrend,
  getBookingTrend,
  getBookingReport,
  getUserReport,
};
