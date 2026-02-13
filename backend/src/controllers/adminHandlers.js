const Journey = require("../models/Journey");

function buildSeats(noOfSeats) {
  const seats = [];
  for (let i = 1; i <= Number(noOfSeats); i++) {
    seats.push({ seatNo: i, status: "available" });
  }
  return seats;
}

// POST /api/admin/trips
async function createJourney(req, res, next) {
  try {
    const {
      from, to,
      departureDate, departureTime,
      arrivalDate, arrivalTime,
      busType, model, depotName,
      pricePerSeat, noOfSeats
    } = req.body;

    const missing = [];
    for (const [k, v] of Object.entries({
      from, to, departureDate, departureTime, busType, model, depotName, pricePerSeat, noOfSeats
    })) {
      if (v === undefined || v === "") missing.push(k);
    }
    if (missing.length) return res.status(400).json({ message: "Missing fields", fields: missing });

    const journey = await Journey.create({
      from, to,
      departureDate, departureTime,
      arrivalDate, arrivalTime,
      busType, model, depotName,
      pricePerSeat, noOfSeats,
      seats: buildSeats(noOfSeats)
    });

    res.status(201).json(journey);
  } catch (e) {
    next(e);
  }
}

// GET /api/admin/trips
async function listJourneys(req, res, next) {
  try {
    const trips = await Journey.find().sort({ createdAt: -1 }).lean();
    res.json({ trips });
  } catch (e) {
    next(e);
  }
}

async function getBookedPassengers(req, res, next) {
  try {
    const { id } = req.params;
    const { q = "", format } = req.query;

    const trip = await Journey.findById(id).lean();
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Only booked seats
    let booked = (trip.seats || []).filter(s => s.status === "booked");

    // Optional search filter
    const needle = q.trim().toLowerCase();
    if (needle) {
      booked = booked.filter(s =>
        String(s.seatNo).includes(needle) ||
        (s.passengerName || "").toLowerCase().includes(needle) ||
        (s.passengerPhone || "").toLowerCase().includes(needle) ||
        (s.passengerEmail || "").toLowerCase().includes(needle)
      );
    }

    // CSV export if requested
    if (String(format).toLowerCase() === "csv") {
      const header = "seatNo,passengerName,passengerPhone,passengerEmail\n";
      const rows = booked
        .map(s =>
          [
            s.seatNo,
            (s.passengerName || "").replace(/"/g, '""'),
            (s.passengerPhone || "").replace(/"/g, '""'),
            (s.passengerEmail || "").replace(/"/g, '""')
          ]
            .map(v => `"${String(v)}"`)
            .join(",")
        )
        .join("\n");

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="booked_${id}.csv"`);
      return res.status(200).send(header + rows);
    }

    // Default JSON
    return res.json({
      trip: {
        _id: trip._id,
        from: trip.from,
        to: trip.to,
        departureDate: trip.departureDate,
        departureTime: trip.departureTime,
        busType: trip.busType,
        noOfSeats: trip.noOfSeats
      },
      count: booked.length,
      seats: booked
    });
  } catch (e) {
    next(e);
  }
}


module.exports = { createJourney, listJourneys, getBookedPassengers, };