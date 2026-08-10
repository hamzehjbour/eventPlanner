const Venues = require("../models/venueModel");

exports.getVenues = async (req, res, next) => {
  try {
    const venues = await Venues.find();

    res.status(200).json({
      status: "success",
      numVenues: venues.length,
      data: {
        venues,
      },
    });
  } catch (err) {
    return next(err);
  }
};
