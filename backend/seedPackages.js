require("dotenv").config();

const mongoose = require("mongoose");
const TourPackage = require("./models/TourPackage");

mongoose.connect(process.env.MONGO_URI || "YOUR_MONGODB_URI");

const packages = [
  {
    title: "Char Dham Yatra",
    slug: "char-dham-yatra",
    description: "Complete Char Dham pilgrimage covering Yamunotri, Gangotri, Kedarnath and Badrinath.",
    duration: 12,
    price: 35000,
    maxGroupSize: 20,
    difficulty: "moderate",
    includes: [
      "Hotel",
      "Meals",
      "Transport",
      "Guide"
    ],
    excludes: [
      "Personal Expenses",
      "Insurance"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival Haridwar",
        description: "Pickup and hotel check-in."
      },
      {
        day: 2,
        title: "Yamunotri",
        description: "Visit Yamunotri Temple."
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        publicId: "chardham1"
      }
    ]
  },
  {
    title: "Kedarnath Tour",
    slug: "kedarnath-tour",
    description: "Visit the holy Kedarnath Temple.",
    duration: 5,
    price: 18000,
    maxGroupSize: 15,
    difficulty: "challenging",
    includes: [
      "Hotel",
      "Transport"
    ],
    excludes: [
      "Helicopter Ticket"
    ],
    itinerary: [
      {
        day: 1,
        title: "Haridwar",
        description: "Journey starts."
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        publicId: "kedarnath1"
      }
    ]
  },
  {
    title: "Badrinath Tour",
    slug: "badrinath-tour",
    description: "Sacred trip to Badrinath.",
    duration: 4,
    price: 16000,
    maxGroupSize: 20,
    difficulty: "easy",
    includes: [
      "Hotel",
      "Breakfast"
    ],
    excludes: [
      "Lunch"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival",
        description: "Hotel Check-in."
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        publicId: "badrinath1"
      }
    ]
  }
];

async function seed() {
  try {
    await TourPackage.deleteMany();
    await TourPackage.insertMany(packages);

    console.log("✅ Packages Inserted Successfully");

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

seed();