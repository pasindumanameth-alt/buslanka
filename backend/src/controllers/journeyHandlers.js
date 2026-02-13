const Journey = require("../models/Journey");

// GET /api/trips/search?from=&to=&date=
async function searchJourneys(req, res, next) {
  try {
    const { from, to, date } = req.query;
    if (!from || !to || !date) {
      return res.status(400).json({ message: "from, to, date are required" });
    }

    const trips = await Journey.find({ from, to, departureDate: date }).lean();

    if (!trips.length) {
      return res
        .status(200)
        .json({ trips: [], message: "No bus available for this route and the date" });
    }

    res.json({ trips });
  } catch (e) {
    next(e);
  }
}

// GET /api/trips/:id
async function getJourneyById(req, res, next) {
  try {
    const trip = await Journey.findById(req.params.id).lean();
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (e) {
    next(e);
  }
}

module.exports = { searchJourneys, getJourneyById };