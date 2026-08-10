const AppError = require("../utils/AppError");

const handleDuplicateFieldsDB = (err) => {
  // console.log(err.keyValue);

  const fields = Object.keys(err.keyValue).join(", ");
  const values = Object.values(err.keyValue).join(", ");

  const message = `Duplicate value for field(s): ${fields} (${values}). Please use another value`;

  return new AppError(message, 409);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");

  return new AppError(message, 400);
};

const sendError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.log("ERROR 💥", err);

  return res.status(err.statusCode).json({
    status: "error",
    message: "Something went wrong. Please try again later",
  });
};

function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // let error = {...err}
  let error = Object.create(err);

  if (error.name === "CastError") error = handleCastErrorDB(error);
  else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  else if (error.name === "ValidationError")
    error = handleValidationErrorDB(error);

  sendError(error, res);
}

module.exports = globalErrorHandler;
