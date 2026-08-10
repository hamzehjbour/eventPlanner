const express = require("express");
const venueController = require("../controllers/venueController");

const router = express.Router();

router.get("/", venueController.getVenues);

module.exports = router;
