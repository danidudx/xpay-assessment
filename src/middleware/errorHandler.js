const {
  ValidationError,
  NotFoundError,
  InsufficientStockError,
} = require("../utils/errors");

function errorHandler(err, req, res, next) {
  console.error(err);

  if (
    err instanceof ValidationError ||
    err instanceof NotFoundError ||
    err instanceof InsufficientStockError
  ) {
    return res.status(err.statusCode).json({
      error: {
        name: err.name,
        message: err.message,
      },
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    error: {
      name: "InternalServerError",
      message: "An unexpected error occurred",
    },
  });
}

module.exports = errorHandler;
