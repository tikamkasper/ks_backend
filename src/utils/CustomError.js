class CustomError extends Error {
  constructor(statusCode = 500, customErrorMessage = "Internal Server Error.") {
    super(); // Call parent constructor (Error)
    this.statusCode = statusCode; // Custom status code
    this.customErrorMessage = customErrorMessage; // Custom error message
    Error.stackTraceLimit = 10; // (default value is 10) or any number you prefer
    // If set to a non-number value, or set to a negative number, stack traces will not capture any frames.
    Error.captureStackTrace(this, this.constructor); // Optional for cleaner stack traces
  }
}
module.exports = { CustomError };
