const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const response = {
    success: true,
    message,
  };
  
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  return res.status(statusCode).json(response);
};

const sendError = (res, message = 'Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  
  if (errors !== null) response.errors = errors;

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};
