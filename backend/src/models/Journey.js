const mongoose = require("mongoose");

// Seat subdocument
const seatSchema = new mongoose.Schema(
  {
    seatNo: { type: Number, required: true },
    status: { type: String, enum: ["available", "booked"], default: "available" },
    passengerName: String,
    passengerPhone: String,
    passengerEmail: String
  },
  { _id: false }
);

// Trip/Journey document
const journeySchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to:   { type: String, required: true },

    // string dates/times for easy equality + display
    departureDate: { type: String, required: true }, // YYYY-MM-DD
    departureTime: { type: String, required: true }, // HH:mm
    arrivalDate:   { type: String },
    arrivalTime:   { type: String },

    busType:   { type: String, required: true },     // Normal | Semi-Luxury | Luxury
    model:     { type: String, required: true },
    depotName: { type: String, required: true },

    pricePerSeat: { type: Number, required: true, min: 0 },
    noOfSeats:    { type: Number, required: true, min: 1 },

    seats: { type: [seatSchema], default: [] }
  },
  { timestamps: true }
);

// compound index for fast search by route + date
journeySchema.index({ from: 1, to: 1, departureDate: 1 });

// Model "Journey" using collection name "trips" (keeps compatibility)
module.exports = mongoose.model("Journey", journeySchema, "trips");