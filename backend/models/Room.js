const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "Hotel reference is required"],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ["single", "double", "deluxe", "suite"],
        message: "Room type must be single, double, deluxe, or suite",
      },
      required: [true, "Room type is required"],
    },
    price: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [0, "Price cannot be negative"],
    },
    capacity: {
      type: Number,
      required: [true, "Room capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    totalRooms: {
      type: Number,
      required: [true, "Total room count is required"],
      min: [1, "Must have at least 1 room"],
    },
    availableRooms: {
      type: Number,
      required: true,
      min: [0, "Available rooms cannot be negative"],
      validate: {
        validator: function (val) {
          return val <= this.totalRooms;
        },
        message: "Available rooms cannot exceed total rooms",
      },
    },
    amenities: [
      {
        type: String,
        trim: true,
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

roomSchema.index({ hotelId: 1, type: 1 }, { unique: true });
roomSchema.index({ hotelId: 1, isActive: 1 });

roomSchema.pre("save", function (next) {
  if (this.isNew && this.availableRooms === undefined) {
    this.availableRooms = this.totalRooms;
  }
  next();
});

module.exports = mongoose.model("Room", roomSchema);
