const { Response } = require("../utils/Response.js");
const { CustomError } = require("../utils/CustomError.js");

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message =
    err.userErrorMessage || statusCode === 500
      ? "Internal Server Error. Please try again later."
      : "An error occurred while processing your request.";
  let devErrorMessage = err.message || "No error trace here.";
  let errorStack = err.stack || "No error stack available";
  let errors = err.errors || []; // If Mongoose validation errors exist

  return Response.error({
    res,
    statusCode,
    message,
    devErrorMessage,
    errorStack,
    errors,
  });
};
module.exports = { globalErrorHandler };
