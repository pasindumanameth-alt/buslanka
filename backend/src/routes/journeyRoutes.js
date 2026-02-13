const router = require("express").Router();
const { searchJourneys, getJourneyById } = require("../controllers/journeyHandlers");

router.get("/search", searchJourneys);
router.get("/:id", getJourneyById);

module.exports = router;