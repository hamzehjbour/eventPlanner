const mongoose = require("mongoose");
const Registrations = require("../models/registrationModel");
const Users = require("../models/userModel");
const Event = require("../models/eventModel");
const AppError = require("../utils/AppError");

exports.getRegistrations = async (req, res, next) => {
  try {
    let filter = {};

    console.log(req.params.eventId);

    if (req.params.eventId) filter = { event: req.params.eventId };

    const registrations = await Registrations.find(filter);

    res.status(200).json({
      status: "success",
      numRegistrations: registrations.length,
      data: {
        registrations,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.createRegistration = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { user, ticketCount } = req.body;

    const event = await Event.findById(req.params.eventId).populate(
      "venue",
      "name capacity",
    );

    // console.log(eventId);

    if (!event) throw new AppError(`No event with that id: ${eventId}`, 404);

    const totalTicketCount = await Registrations.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $group: {
          _id: "$event",
          totalTicketCount: {
            $sum: "$ticketCount",
          },
        },
      },
    ]);

    const currentTicketCount = totalTicketCount.at(0)?.totalTicketCount ?? 0;
    // console.log(ticketCount);
    // console.log(event.venue.capacity);

    if (currentTicketCount + ticketCount >= event.venue.capacity)
      throw new AppError("The venue have reached its maximum capacity", 400);

    const userDoc = await Users.findOne({ name: user });

    if (!userDoc) throw new AppError("We couldn't find this user", 400);

    const newData = {
      event: eventId,
      user: userDoc._id,
      ticketCount,
    };

    // console.log(newData);

    const newRegistration = await Registrations.create(newData);

    res.status(200).json({
      status: "success",
      newData,
    });
  } catch (err) {
    return next(err);
  }
};
