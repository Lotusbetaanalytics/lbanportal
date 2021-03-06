class ErrorResponse extends Error {
  constructor(msg, statusCode) {
    super(msg);
    this.statusCode = statusCode;
  }
}

class ErrorResponseJSON {
  constructor(res, msg, statusCode) {
    console.log(msg, "error message");
    return res.status(statusCode).json({
      success: false,
      msg: msg,
    });
  }
}

module.exports = { ErrorResponse, ErrorResponseJSON };
