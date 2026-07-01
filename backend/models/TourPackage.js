const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day number is required"],
      min: [1, "Day must start from 1"],
    },
    title: {
      type: String,
      required: [true, "Itinerary day title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Itinerary day description is required"],
    },
  },
  { _id: false }
);

const tourPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 day"],
      max: [30, "Duration cannot exceed 30 days"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    maxGroupSize: {
      type: Number,
      default: 20,
      min: [1, "Group size must be at least 1"],
    },
    difficulty: {
      type: String,
      enum: {
        values: ["easy", "moderate", "challenging"],
        message: "Difficulty must be easy, moderate, or challenging",
      },
      default: "moderate",
    },
    includes: [
      {
        type: String,
        trim: true,
      },
    ],
    excludes: [
      {
        type: String,
        trim: true,
      },
    ],
    itinerary: {
      type: [itinerarySchema],
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: "At least one itinerary day is required",
      },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

tourPackageSchema.index({ slug: 1 });
tourPackageSchema.index({ isActive: 1, difficulty: 1 });
tourPackageSchema.index({ price: 1 });
tourPackageSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("TourPackage", tourPackageSchema);
