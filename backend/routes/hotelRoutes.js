const express = require("express");
const router = express.Router();
const { getAllHotels, getHotelById, getHotelRooms } = require("../controllers/hotelController");

router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.get("/:id/rooms", getHotelRooms);

module.exports = router;
