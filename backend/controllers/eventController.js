const Event = require("../models/eventModel");
const User = require("../models/userModel");
const Venue = require("../models/venueModel");
const AppError = require("../utils/AppError");

exports.getEvents = async (req, res, next) => {
  try {
    // console.log(req.query);
    const { city, category, page = 1, limit = 10, q } = req.query;
    const filter = {};

    if (city) {
      const venueIds = await Venue.find({
        city: new RegExp(`^${city}$`, "i"),
      }).distinct("_id");

      // console.log(venueIds);
      filter.venue = { $in: venueIds };
    }

    if (category) {
      // category = category.split(",");

      filter.categories = { $in: category.split(",") };
    }

    if (q) {
      const regex = new RegExp(q, "i");

      filter.$or = [{ title: regex }, { description: regex }];
    }

    const skip = (page - 1) * limit;

    const events = await Event.find(filter)
      .populate("venue")
      .skip(skip)
      .limit(Number(limit));

    const totalDocs = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);

    res.status(200).json({
      status: "success",
      page,
      totalPages,
      numEvents: events.length,
      data: {
        events,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate("organizer", "name");

    if (!event) throw new AppError("No event with that ID", 404);

    res.status(200).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { venue, organizer } = req.body;

    const organizerDoc = await User.findOne({ name: organizer });
    const venueDoc = await Venue.findOne({ name: venue });

    if (!organizerDoc)
      throw new AppError("We couldn't find the organizer", 404);

    if (!venueDoc) throw new AppError("We don't have this venue listed", 404);

    const newData = {
      ...req.body,
      venue: venueDoc._id,
      organizer: organizerDoc._id,
    };

    const newEvent = await Event.create(newData);

    res.status(201).json({
      status: "success",
      data: {
        newEvent,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    let organizerDoc;
    let venueDoc;
    const updatedData = { ...req.body };

    if (req.body.organizer) {
      organizerDoc = await User.findOne({ name: req.body.organizer });
      if (!organizerDoc)
        throw new AppError("We couldn't find the organizer", 404);

      updatedData.organizer = organizerDoc._id;
    }

    if (req.body.venue) {
      venueDoc = await Venue.findOne({ name: req.body.venue });
      if (!venueDoc) throw new AppError("We don't have this venue listed", 404);

      updatedData.venue = venueDoc._id;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    if (!updatedEvent) throw new AppError("We couldn't find the event", 404);

    res.status(200).json({
      status: "success",
      data: {
        updatedEvent,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    return next(err);
  }
};

/*
{
  'sports',
  'education',
  'music',
  'charity',
  'food',
  'fashion',
  'health',
  'networking',
  'literature',
  'art',
  'comedy',
  'science',
  'business',
  'film',
  'gaming'
}
*/
