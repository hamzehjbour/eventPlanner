const express = require("express");
const statsController = require("../controllers/statsController");

const router = express.Router();

router.get("/top-venues", statsController.getTopVenues);

module.exports = router;
