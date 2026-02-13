require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errors");

const journeyRoutes = require("./routes/journeyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// core middleware
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// healthcheck
app.get("/", (_, res) => res.json({ ok: true, service: "BusLanka API" }));

// routes
app.use("/api/trips", journeyRoutes);     // search + get by id
app.use("/api/admin", adminRoutes);       // create/list trips
app.use("/api/bookings", bookingRoutes);  // create booking

// error handlers
app.use(notFound);
app.use(errorHandler);

// start server after DB connect
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`🚏 BusLanka API running on :${PORT}`));
  })
  .catch((err) => {
    console.error("✖ Failed to connect to MongoDB:", err.message || err);
    console.error("Ensure `MONGODB_URI` is set correctly in your .env or environment variables.");
    process.exit(1);
  });