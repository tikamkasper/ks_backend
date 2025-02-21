const { NODE_ENV } = require("../config");

class Response {
  static success(
    res,
    statusCode = 200,
    message = "Request successful.",
    data = {}
  ) {
    return res.status(statusCode).json({
      statusCode,
      success: true,
      message,
      data,
    });
  }

  static error(
    res,
    statusCode = 500,
    message = statusCode === 500
      ? "Internal Server Error. Please try again later."
      : "An error occurred while processing your request.",
    errors = []
  ) {
    return res.status(statusCode).json({
      statusCode,
      success: false,
      message,
      ...(NODE_ENV === "development" && originalErrorMessage),
      ...(NODE_ENV === "development" && errors),
    });
  }
}

module.exports = { Response };
