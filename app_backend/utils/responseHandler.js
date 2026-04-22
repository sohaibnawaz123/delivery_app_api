const normalizeErrorObject = (errorObj) => {
  if (typeof errorObj === "string") {
    return {
      statusCode: 500,
      message: errorObj
    };
  }

  if (!errorObj || typeof errorObj !== "object") {
    return {
      statusCode: 500,
      message: "Something went wrong."
    };
  }

  return {
    statusCode: Number.isInteger(errorObj.statusCode) ? errorObj.statusCode : 500,
    message: errorObj.message || "Something went wrong."
  };
};

const errorResponse = (res, errorObj) => {
  const normalizedError = normalizeErrorObject(errorObj);

  return res.status(normalizedError.statusCode).json({
    success: false,
    message: normalizedError.message
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
