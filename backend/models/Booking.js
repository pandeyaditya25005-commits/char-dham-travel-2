const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: [true, "Booking ID is required"],
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ["package", "hotel"],
        message: "Booking type must be package or hotel",
      },
      required: [true, "Booking type is required"],
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourPackage",
      validate: {
        validator: function (val) {
          if (this.type === "package" && !val) return false;
          return true;
        },
        message: "Package reference is required for package bookings",
      },
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      validate: {
        validator: function (val) {
          if (this.type === "hotel" && !val) return false;
          return true;
        },
        message: "Hotel reference is required for hotel bookings",
      },
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    travelDate: {
      type: Date,
      required: [true, "Travel date is required"],
      validate: {
        validator: function (val) {
          return val >= new Date(new Date().toDateString());
        },
        message: "Travel date cannot be in the past",
      },
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (val) {
          return val >= this.travelDate;
        },
        message: "End date must be after travel date",
      },
    },
    numberOfPersons: {
      type: Number,
      required: [true, "Number of persons is required"],
      min: [1, "At least 1 person is required"],
      max: [50, "Cannot exceed 50 persons"],
    },
    numberOfRooms: {
      type: Number,
      min: [1, "At least 1 room is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "cancelled", "completed"],
        message: "Status must be pending, confirmed, cancelled, or completed",
      },
      default: "pending",
    },
    specialRequests: {
      type: String,
      maxlength: [1000, "Special requests cannot exceed 1000 characters"],
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ type: 1 });
bookingSchema.index({ travelDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
