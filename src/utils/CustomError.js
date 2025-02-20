class CustomError extends Error {
  constructor(statusCode, message) {
    super(message); // Call parent constructor (Error)
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // Optional for cleaner stack traces
  }
}

module.exports = CustomError;
