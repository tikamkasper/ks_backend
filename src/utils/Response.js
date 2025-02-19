class Response {
  static success(res, statusCode = 200, data = {}, message = "Success") {
    return res.status(statusCode).json({
      statusCode,
      data,
      message,
      success: true,
    });
  }

  static error(
    res,
    statusCode = 500,
    message = "Something went wrong",
    errors = []
  ) {
    return res.status(statusCode).json({
      statusCode,
      message,
      errors,
      success: false,
    });
  }
}

module.exports = { Response };
