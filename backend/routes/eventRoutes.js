const express = require("express");
const eventController = require("../controllers/eventController");
const registrationRouter = require("./registrationRoutes");

const router = express.Router();

router.use("/:eventId/attendees", registrationRouter);
router.use("/:eventId/register", registrationRouter);

router
  .get("/:id", eventController.getEvent)
  .patch("/:id", eventController.updateEvent)
  .delete("/:id", eventController.deleteEvent)
  .get("/", eventController.getEvents)
  .post("/", eventController.createEvent);

module.exports = router;
