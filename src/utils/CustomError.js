class CustomError extends Error {
  constructor({
    userErrorMessage = "No user error message provided by the developer ",
    devErrorMessage = "No error message provided by the developer.",
    statusCode = 500,
  } = {}) {
    super(devErrorMessage); // This sets the error message in the base Error class
    this.userErrorMessage = userErrorMessage; // This sets the error message in the CustomError class
    this.statusCode = statusCode; // Custom property for HTTP status codes
    Error.stackTraceLimit = 10; // Limit stack trace depth (default value is 10) or any number you prefer
    // If set to a non-number value, or set to a negative number, stack traces will not capture any frames.
    Error.captureStackTrace(this, this.constructor); // Optional for cleaner stack traces
  }
}
module.exports = { CustomError };
