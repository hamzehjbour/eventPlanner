const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const venueRouter = require("./routes/venueRoutes");
const eventRouter = require("./routes/eventRoutes");
const registrationRouter = require("./routes/registrationRoutes");
const statsRouter = require("./routes/statsRoutes");

const globalErrorHandler = require("./controllers/errorController");

const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

app.use(cors({ origin: allowedOrigins }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/venues", venueRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/registration", registrationRouter);
app.use("/api/v1/stats", statsRouter);

app.use(globalErrorHandler);

module.exports = app;
