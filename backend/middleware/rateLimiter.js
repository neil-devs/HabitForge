const { authLimiter, generalLimiter } = require('../config/rateLimit');

// Simple wrapper to apply limiters based on route
const rateLimiter = (type = 'general') => {
  if (type === 'auth') {
    return authLimiter;
  }
  return generalLimiter;
};

module.exports = rateLimiter;
