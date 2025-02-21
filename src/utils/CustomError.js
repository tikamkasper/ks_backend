class CustomError extends Error {
  constructor(statusCode, message = "Something went wrong.") {
    super(); // Call parent constructor (Error)
    this.statusCode = statusCode; // Custom status code
    this.message = message; // Custom error message
    Error.captureStackTrace(this, this.constructor); // Optional for cleaner stack traces
  }
}
