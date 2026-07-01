const express = require("express");
const router = express.Router();
const { getAllPackages, getPackageBySlug } = require("../controllers/packageController");

router.get("/", getAllPackages);
router.get("/:slug", getPackageBySlug);

module.exports = router;
