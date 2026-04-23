const { sendError } = require('../utils/response');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  // Handle specific database errors
  if (err.code === '23505') { // unique_violation
    return sendError(res, 'A record with that value already exists.', 409);
  }

  if (err.code === '23503') { // foreign_key_violation
    return sendError(res, 'Referenced record does not exist.', 400);
  }

  // Generic fallback
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
