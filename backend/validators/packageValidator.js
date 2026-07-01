const { body } = require("express-validator");

const createPackageValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("slug").trim().notEmpty().withMessage("Slug is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be at least 1 day"),
  body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
  body("maxGroupSize").optional().isInt({ min: 1 }),
  body("difficulty").optional().isIn(["easy", "moderate", "challenging"]),
];

module.exports = { createPackageValidator };
