const { Response } = require("../utils/Response.js");

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.customErrorMessage
    ? err.customErrorMessage
    : statusCode === 500
      ? "Internal Server Error. Please try again later."
      : "An error occurred while processing your request.";
  let originalErrorMessage = err.message;
  let errorStack = err.stack || "";
  let errors = err.errors || []; // If Mongoose validation errors exist

  return Response.error(
    res,
    statusCode,
    message,
    originalErrorMessage,
    errorStack,
    errors
  );
};
module.exports = { globalErrorHandler };
