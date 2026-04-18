const errorResponse = (res, errorObj) => {
  return res.status(errorObj.statusCode).json({
    success: false,
    message: errorObj.message
  });
};

const successResponse = (res, message, payload = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...payload
  });
};

module.exports = {
  errorResponse,
  successResponse
};
