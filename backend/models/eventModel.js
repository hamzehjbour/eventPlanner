const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  startsAt: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
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
  },
});

eventSchema.index({ venue: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ startsAt: 1 });

// --- Cascade delete: removing an event must not leave orphaned registrations ---
// Covers both query-style deletes (Event.findByIdAndDelete / findOneAndDelete)
// and document-style deletes (eventDoc.deleteOne()).

eventSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await mongoose.model("Registration").deleteMany({ event: doc._id });
  }
  next();
});

eventSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await mongoose.model("Registration").deleteMany({ event: this._id });
    next();
  },
);

// Also cover bulk deletes, e.g. Event.deleteMany({ venue: someVenueId })
eventSchema.pre("deleteMany", async function (next) {
  const docs = await this.model.find(this.getQuery(), { _id: 1 });
  const ids = docs.map((d) => d._id);
  if (ids.length) {
    await mongoose.model("Registration").deleteMany({ event: { $in: ids } });
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
