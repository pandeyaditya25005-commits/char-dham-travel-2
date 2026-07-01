const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    starRating: {
      type: Number,
      min: [1, "Minimum star rating is 1"],
      max: [5, "Maximum star rating is 5"],
      default: 3,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
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
  },
  {
    timestamps: true,
  }
);

hotelSchema.index({ location: 1 });
hotelSchema.index({ isActive: 1 });
hotelSchema.index({ starRating: -1 });
hotelSchema.index({ name: "text", location: "text" });

module.exports = mongoose.model("Hotel", hotelSchema);
