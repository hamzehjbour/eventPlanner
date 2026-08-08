const fs = require("fs");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Event = require("./models/eventModel");
const Venue = require("./models/venueModel");
const Registration = require("./models/registration");

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const events = JSON.parse(
  fs.readFileSync(`${__dirname}/data/events.json`, "utf-8"),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, "utf-8"),
);
const venues = JSON.parse(
  fs.readFileSync(`${__dirname}/data/venues.json`, "utf-8"),
);

const registrations = JSON.parse(
  fs.readFileSync(`${__dirname}/data/registrations.json`, "utf-8"),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await User.create(users);
    await Venue.create(venues);
    await Event.create(events);
    await Registration.create(registrations);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Venue.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
