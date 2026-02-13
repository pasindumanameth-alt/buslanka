const router = require("express").Router();
const { createReservation } = require("../controllers/bookingHandlers");

router.post("/", createReservation);

module.exports = router;