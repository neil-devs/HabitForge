const rateLimit = require('express-rate-limit');

// Rate limiters per route group
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after a minute',
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  message: {
    success: false,
    message: 'Too many requests, please try again after a minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  generalLimiter,
};
