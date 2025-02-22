const { NODE_ENV } = require("../config");

class Response {
  static success({
    res,
    statusCode = 200,
    message = "Request successful.",
    data = {},
  } = {}) {
    return res.status(statusCode).json({
      statusCode,
      success: true,
      message,
      data,
    });
  }

  static error({
    res,
    statusCode = 500,
    message = statusCode === 500
      ? "Oops! Something went wrong on our end. Please try again later."
      : "We encountered an issue while processing your request. Please try again.",
    devErrorMessage = "",
    errorStack = "",
    errors = [],
  } = {}) {
    return res.status(statusCode).json({
      statusCode,
      success: false,
      message,
      ...(NODE_ENV === "development" && {
        devErrorMessage,
        errorStack,
        errors,
      }),
    });
  }
}

module.exports = { Response };
