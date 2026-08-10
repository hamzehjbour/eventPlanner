const Registration = require("../models/registrationModel");

exports.getTopVenues = async (req, res, next) => {
  try {
    const topVenues = await Registration.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $lookup: {
          from: "venues",
          localField: "event.venue",
          foreignField: "_id",
          as: "venue",
        },
      },
      {
        $unwind: "$venue",
      },

      {
        $group: {
          _id: "$venue._id",
          venueName: { $first: "$venue.name" },
          city: { $first: "$venue.city" },
          capacity: { $first: "$venue.capacity" },
          totalRegistration: { $sum: "$ticketCount" },
        },
      },

      {
        $sort: {
          totalRegistration: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $set: {
          venueId: "$_id",
        },
      },

      {
        $unset: ["_id"],
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        topVenues,
      },
    });
  } catch (err) {
    return next(err);
  }
};
