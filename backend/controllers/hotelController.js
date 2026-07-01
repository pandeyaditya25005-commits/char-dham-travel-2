const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllHotels = asyncHandler(async (req, res) => {
  const { location, search, page = 1, limit = 10 } = req.query;
  const filter = { isActive: true };

  if (location) filter.location = { $regex: location, $options: "i" };
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Hotel.countDocuments(filter);

  const hotels = await Hotel.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort("-createdAt");

  res.json({
    success: true,
    count: hotels.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    hotels,
  });
});

const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    throw new AppError("Hotel not found", 404);
  }
  res.json({ success: true, hotel });
});

const getHotelRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ hotelId: req.params.id, isActive: true });
  res.json({ success: true, rooms });
});

module.exports = { getAllHotels, getHotelById, getHotelRooms };
