const express = require("express");
const router = express.Router();

const {
  getAllPackages,
  getPackageBySlug,
  seedPackages
} = require("../controllers/packageController");

router.get("/seed", seedPackages);

router.get("/", getAllPackages);

router.get("/:slug", getPackageBySlug);

module.exports = router;