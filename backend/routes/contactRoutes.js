const express = require("express");
const router = express.Router();
const { submitContact } = require("../controllers/contactController");
const validate = require("../utils/validate");
const { contactValidator } = require("../validators/contactValidator");

router.post("/", contactValidator, validate, submitContact);

module.exports = router;
