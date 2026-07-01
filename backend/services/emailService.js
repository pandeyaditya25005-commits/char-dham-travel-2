const { createTransporter } = require("../config/nodemailer");
const fs = require("fs");
const path = require("path");

const loadTemplate = (templateName, replacements) => {
  const templatePath = path.join(__dirname, "..", "templates", templateName);
  let html = fs.readFileSync(templatePath, "utf-8");
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return html;
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Char Dham Travel" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

const sendOtpEmail = async (email, otp, purpose = "verification") => {
  const subject =
    purpose === "reset"
      ? "Password Reset OTP - Char Dham Travel"
      : "Email Verification - Char Dham Travel";

  const template =
    purpose === "reset" ? "resetOtpEmail.html" : "otpEmail.html";

  const html = loadTemplate(template, { otp, email });
  await sendEmail({ to: email, subject, html });
};

const sendBookingConfirmation = async (email, booking) => {
  const type = booking.type === "package" ? "Tour Package" : "Hotel Booking";
  const html = loadTemplate("bookingConfirmation.html", {
    bookingId: booking.bookingId,
    name: booking.contactEmail,
    date: new Date(booking.travelDate).toDateString(),
    amount: booking.totalAmount.toFixed(2),
    type,
    status: booking.status,
  });
  await sendEmail({
    to: email,
    subject: `Booking Confirmed - ${booking.bookingId}`,
    html,
  });
};

const sendBookingStatusUpdate = async (email, booking) => {
  const statusMessages = {
    confirmed: "Your booking has been confirmed. We look forward to serving you!",
    cancelled: "Your booking has been cancelled as requested.",
    completed: "Your booking has been marked as completed. Thank you for travelling with us!",
    pending: "Your booking is currently pending review.",
  };

  const type = booking.type === "package" ? "Tour Package" : "Hotel Booking";
  const html = loadTemplate("bookingStatusEmail.html", {
    bookingId: booking.bookingId,
    customerName: booking.contactEmail,
    type,
    travelDate: new Date(booking.travelDate).toDateString(),
    status: booking.status.toUpperCase(),
    amount: booking.totalAmount.toFixed(2),
    message: statusMessages[booking.status] || `Your booking status has been updated to ${booking.status}.`,
  });
  await sendEmail({
    to: email,
    subject: `Booking ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} - ${booking.bookingId}`,
    html,
  });
};

const sendContactNotification = async (contact) => {
  const html = loadTemplate("contactNotification.html", {
    name: contact.name,
    email: contact.email,
    subject: contact.subject,
    message: contact.message,
  });
  await sendEmail({
    to: process.env.SMTP_USER,
    subject: `New Contact: ${contact.subject}`,
    html,
  });
};

module.exports = { sendOtpEmail, sendBookingConfirmation, sendBookingStatusUpdate, sendContactNotification };
