const { BOOKING_ID_PREFIX } = require("./constants");

const generateBookingId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${BOOKING_ID_PREFIX}-${timestamp}${random}`;
};

module.exports = generateBookingId;
