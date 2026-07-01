const Contact = require("../models/Contact");
const { sendContactNotification } = require("../services/emailService");
const asyncHandler = require("../utils/asyncHandler");

const submitContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create(req.body);

  try {
    await sendContactNotification(contact);
  } catch (err) {
    console.error("Contact email failed:", err.message);
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
  });
});

module.exports = { submitContact };
