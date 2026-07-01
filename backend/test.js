require("dotenv").config();

const mongoose = require("mongoose");

console.log("Starting test...");
console.log("URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log("✅ Connected Successfully!");
    console.log("Host:", conn.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection Failed:");
    console.error(err);
    process.exit(1);
  });