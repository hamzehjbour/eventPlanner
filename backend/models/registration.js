const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
    required: true,
  },
  ticketCount: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
