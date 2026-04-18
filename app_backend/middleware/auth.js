const { errorResponse } = require("../utils/responseHandler");
const getErrorCode = require("../utils/error");
const { errorName } = require("../utils/constants");
const { isStrongPassword } = require("../utils/auth");

const getMissingFields = (body, fields) => {
  return fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || String(value).trim() === "";
  });
};

const validateSignupPayload = (req, res, next) => {
  const requiredFields = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "password",
    "confirm_password",
    "fcm_token",
    "token"
  ];
  const missing = getMissingFields(req.body, requiredFields);

  if (missing.length > 0) {
    return errorResponse(res, {
      statusCode: 400,
      message: `Missing required fields: ${missing.join(", ")}`
    });
  }

  if (String(req.body.password) !== String(req.body.confirm_password)) {
    return errorResponse(res, getErrorCode(errorName.PASSWORD_MISMATCH));
  }

  if (!isStrongPassword(req.body.password)) {
    return errorResponse(res, getErrorCode(errorName.WEAKPASSWORD));
  }

  return next();
};

const validateLoginPayload = (req, res, next) => {
  const requiredFields = ["email", "password"];
  const missing = getMissingFields(req.body, requiredFields);

  if (missing.length > 0) {
    return errorResponse(res, {
      statusCode: 400,
      message: `Missing required fields: ${missing.join(", ")}`
    });
  }

  return next();
};

const validateEmailOtpPayload = (req, res, next) => {
  const requiredFields = ["email", "otp"];
  const missing = getMissingFields(req.body, requiredFields);

  if (missing.length > 0) {
    return errorResponse(res, {
      statusCode: 400,
      message: `Missing required fields: ${missing.join(", ")}`
    });
  }

  return next();
};

const validateForgotPasswordPayload = (req, res, next) => {
  const requiredFields = ["email"];
  const missing = getMissingFields(req.body, requiredFields);

  if (missing.length > 0) {
    return errorResponse(res, {
      statusCode: 400,
      message: `Missing required fields: ${missing.join(", ")}`
    });
  }

  return next();
};

const validateResetPasswordPayload = (req, res, next) => {
  const requiredFields = ["email", "otp", "password", "confirm_password"];
  const missing = getMissingFields(req.body, requiredFields);

  if (missing.length > 0) {
    return errorResponse(res, {
      statusCode: 400,
      message: `Missing required fields: ${missing.join(", ")}`
    });
  }

  if (String(req.body.password) !== String(req.body.confirm_password)) {
    return errorResponse(res, getErrorCode(errorName.PASSWORD_MISMATCH));
  }

  if (!isStrongPassword(req.body.password)) {
    return errorResponse(res, getErrorCode(errorName.WEAKPASSWORD));
  }

  return next();
};

module.exports = {
  validateSignupPayload,
  validateLoginPayload,
  validateEmailOtpPayload,
  validateForgotPasswordPayload,
  validateResetPasswordPayload
};
