const router = require("express").Router();
const { createJourney, listJourneys, getBookedPassengers } = require("../controllers/adminHandlers");

router.post("/trips", createJourney);
router.get("/trips", listJourneys);
router.get("/trips/:id/bookings", getBookedPassengers);


module.exports = router;