const TourPackage = require("../models/TourPackage");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllPackages = asyncHandler(async (req, res) => {
  const { difficulty, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

  const filter = { isActive: true };

  if (difficulty) filter.difficulty = difficulty;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await TourPackage.countDocuments(filter);

  const packages = await TourPackage.find(filter)
    .select("-itinerary")
    .skip(skip)
    .limit(Number(limit))
    .sort("-createdAt");

  res.json({
    success: true,
    count: packages.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    packages,
  });
});

const getPackageBySlug = asyncHandler(async (req, res) => {
  const pkg = await TourPackage.findOne({ slug: req.params.slug, isActive: true });
  if (!pkg) {
    throw new AppError("Package not found", 404);
  }
  res.json({ success: true, package: pkg });
});

module.exports = { getAllPackages, getPackageBySlug };
