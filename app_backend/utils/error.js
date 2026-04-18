const { errorName } = require("./constants");

const errorMap = {
  [errorName.BADREQUEST]: {
    statusCode: 400,
    message: "Invalid request payload."
  },
  [errorName.UNAUTHORIZED]: {
    statusCode: 401,
    message: "Invalid email or password."
  },
  [errorName.FORBIDDEN]: {
    statusCode: 403,
    message: "Please verify your email using OTP before login."
  },
  [errorName.CONFLICT]: {
    statusCode: 409,
    message: "Resource already exists."
  },
  [errorName.CONFLICT_EMAIL]: {
    statusCode: 409,
    message: "Email is already registered."
  },
  [errorName.CONFLICT_PHONE]: {
    statusCode: 409,
    message: "Phone number is already registered."
  },
  [errorName.NOTFOUND]: {
    statusCode: 404,
    message: "Requested resource not found."
  },
  [errorName.INVALIDOTP]: {
    statusCode: 400,
    message: "Invalid OTP."
  },
  [errorName.OTPEXPIRED]: {
    statusCode: 400,
    message: "OTP is expired."
  },
  [errorName.ALREADYVERIFIED]: {
    statusCode: 409,
    message: "Email is already verified."
  },
  [errorName.PASSWORD_MISMATCH]: {
    statusCode: 400,
    message: "Password and confirm password do not match."
  },
  [errorName.WEAKPASSWORD]: {
    statusCode: 400,
    message: "Password must be at least 8 characters with uppercase, lowercase, and number."
  },
  [errorName.INTERNALSERVER]: {
    statusCode: 500,
    message: "Something went wrong."
  }
};

const getErrorCode = (name) => {
  return errorMap[name] || errorMap[errorName.INTERNALSERVER];
};

module.exports = getErrorCode;
