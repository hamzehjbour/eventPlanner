const express = require("express");
const registrationController = require("../controllers/registrationController");

const router = express.Router({ mergeParams: true });

router
  .get("/", registrationController.getRegistrations)
  .post("/", registrationController.createRegistration);

module.exports = router;
