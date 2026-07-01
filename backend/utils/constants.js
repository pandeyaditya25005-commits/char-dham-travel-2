const OTP_EXPIRY_MINUTES = 5;
const BOOKING_CANCEL_HOURS = 48;

const BOOKING_ID_PREFIX = "CDH";

const PACKAGE_DIFFICULTY = ["easy", "moderate", "challenging"];
const ROOM_TYPES = ["single", "double", "deluxe", "suite"];
const BOOKING_TYPES = ["package", "hotel"];
const BOOKING_STATUSES = ["pending", "confirmed", "cancelled", "completed"];
const USER_ROLES = ["user", "admin"];

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

module.exports = {
  OTP_EXPIRY_MINUTES,
  BOOKING_CANCEL_HOURS,
  BOOKING_ID_PREFIX,
  PACKAGE_DIFFICULTY,
  ROOM_TYPES,
  BOOKING_TYPES,
  BOOKING_STATUSES,
  USER_ROLES,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
};
