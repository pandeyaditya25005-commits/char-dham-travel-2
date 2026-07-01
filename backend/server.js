const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const { configureCloudinary } = require("./config/cloudinary");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

const app = require("./app");

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();
    configureCloudinary();

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) server.close(() => process.exit(0));
  else process.exit(0);
});
