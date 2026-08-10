const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "An event must have a title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "An event must have a description"],
  },
  startsAt: {
    type: Date,
    required: [true, "An event must have a starting time"],
  },
  price: {
    type: Number,
    required: [true, "An event must have a price"],
    min: 0,
    default: 0,
  },
  venue: {
    type: mongoose.Schema.ObjectId,
    ref: "Venue",
    required: true,
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  categories: {
    type: [String],
    default: [],
    required: [true, "You must include the event's categories"],
  },
});

eventSchema.index({ venue: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ startsAt: 1 });

eventSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  // console.log(doc);
  if (!doc) {
    throw new Error("Event not found");
  }
  await mongoose.model("Registration").deleteMany({ event: doc._id });
});

module.exports = mongoose.model("Event", eventSchema);
