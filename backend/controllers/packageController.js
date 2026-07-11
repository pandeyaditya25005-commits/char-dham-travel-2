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
const seedPackages = asyncHandler(async (req, res) => {
  await TourPackage.deleteMany();

  await TourPackage.insertMany([
    {
      title: "Char Dham Yatra",
      slug: "char-dham-yatra",
      description: "Complete Char Dham pilgrimage.",
      duration: 12,
      price: 35000,
      maxGroupSize: 20,
      difficulty: "moderate",
      includes: ["Hotel", "Meals", "Transport"],
      excludes: ["Personal Expenses"],
      itinerary: [
        {
          day: 1,
          title: "Arrival",
          description: "Arrival at Haridwar"
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          publicId: "char1"
        }
      ]
    },
    {
      title: "Kedarnath Tour",
      slug: "kedarnath-tour",
      description: "Holy Kedarnath Temple.",
      duration: 5,
      price: 18000,
      maxGroupSize: 15,
      difficulty: "challenging",
      includes: ["Hotel", "Transport"],
      excludes: ["Helicopter"],
      itinerary: [
        {
          day: 1,
          title: "Start",
          description: "Journey starts"
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
          publicId: "kedar1"
        }
      ]
    }
  ]);

  res.json({
    success: true,
    message: "Packages inserted successfully"
  });
});


module.exports = {
  getAllPackages,
  getPackageBySlug,
  seedPackages
};
