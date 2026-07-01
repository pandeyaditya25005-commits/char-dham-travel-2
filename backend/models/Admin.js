const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },
    permissions: {
      type: [
        {
          type: String,
          enum: [
            "manage_users",
            "manage_packages",
            "manage_hotels",
            "manage_bookings",
            "manage_contacts",
            "manage_admins",
          ],
        },
      ],
      default: [
        "manage_users",
        "manage_packages",
        "manage_hotels",
        "manage_bookings",
        "manage_contacts",
      ],
    },
    lastLogin: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "suspended"],
        message: "Status must be active or suspended",
      },
      default: "active",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.index({ userId: 1 });
adminSchema.index({ status: 1 });

module.exports = mongoose.model("Admin", adminSchema);
