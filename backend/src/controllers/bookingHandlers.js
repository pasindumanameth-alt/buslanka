const mongoose = require("mongoose");
const Journey = require("../models/Journey");

// POST /api/bookings
// body: { tripId, seats:[Number], passenger:{ name, phone, email? } }
async function createReservation(req, res, next) {
  const useTx = String(process.env.USE_TRANSACTIONS).toLowerCase() === "true";
  let session = null;

  try {
    const { tripId, seats, passenger } = req.body;
    if (!tripId || !Array.isArray(seats) || seats.length === 0 || !passenger?.name || !passenger?.phone) {
      return res.status(400).json({ message: "tripId, seats[], passenger.name, passenger.phone are required" });
    }

    if (useTx) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    const trip = useTx
      ? await Journey.findById(tripId).session(session)
      : await Journey.findById(tripId);

    if (!trip) {
      if (useTx) await session.abortTransaction();
      return res.status(404).json({ message: "Trip not found" });
    }

    // verify seats exist and are not already booked
    for (const sn of seats) {
      const seat = trip.seats.find(s => s.seatNo === Number(sn));
      if (!seat) throw new Error(`Seat ${sn} does not exist`);
      if (seat.status === "booked") throw new Error(`Seat ${sn} already booked`);
    }

    // mark seats booked + store passenger info
    for (const sn of seats) {
      const seat = trip.seats.find(s => s.seatNo === Number(sn));
      seat.status = "booked";
      seat.passengerName = passenger.name;
      seat.passengerPhone = passenger.phone;
      seat.passengerEmail = passenger.email || undefined;
    }

    await trip.save(useTx ? { session } : {});

    if (useTx) {
      await session.commitTransaction();
      session.endSession();
    }

    res.status(201).json({ message: "Seats booked successfully", tripId: trip._id, seats });
  } catch (err) {
    if (session) {
      try { await session.abortTransaction(); } catch {}
      session.endSession();
    }
    next(err);
  }
}

module.exports = { createReservation };