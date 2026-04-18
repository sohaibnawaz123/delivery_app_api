const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { successResponse, errorResponse } = require("../utils/responseHandler");
const { errorName, successName } = require("../utils/constants");
const getErrorCode = require("../utils/error");
const { getModels } = require("../db/models");
const { normalizeEmail, generateOtp, getOtpExpiryDate, isStrongPassword } = require("../utils/auth");

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

const getUserModel = () => {
  const { users } = getModels();
  return users;
};

const getAuthSecrets = () => {
  return {
    accessSecret: process.env.JWT_SECRET_KEY || "delivery-api-access-secret",
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET || "delivery-api-refresh-secret",
    accessExpiresIn: process.env.JWT_EXPIRES || "1d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || "7d"
  };
};

const sanitizeUser = (user) => {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    fcm_token: user.fcm_token,
    device_token: user.device_token,
    is_email_verified: user.is_email_verified,
    metadata: user.metadata,
    created_at: user.createdAt,
    updated_at: user.updatedAt
  };
};

const getOtpResponse = (otp) => {
  if (String(process.env.NODE_ENV || "").toLowerCase() === "production") {
    return {};
  }

  return { otp };
};

const sendOtpForNow = (purpose, email, otp) => {
  console.log(`[AUTH][${purpose}] OTP for ${email}: ${otp}`);
};

const signup = async (req, res) => {
  try {
    const User = getUserModel();
    if (!User) {
      return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
    }

    const {
      first_name: firstName,
      last_name: lastName,
      email: rawEmail,
      phone_number: phoneNumber,
      password,
      fcm_token: fcmToken,
      token,
      confirm_password: _confirmPassword,
      ...otherFields
    } = req.body;

    const email = normalizeEmail(rawEmail);
    const emailOtp = generateOtp();
    const emailOtpExpiry = getOtpExpiryDate(OTP_TTL_MINUTES);
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const metadata = Object.keys(otherFields).length > 0 ? otherFields : null;

    const existingByPhone = await User.findOne({
      where: {
        phone_number: phoneNumber,
        email: { [Op.ne]: email }
      }
    });

    if (existingByPhone) {
      return errorResponse(res, getErrorCode(errorName.CONFLICT_PHONE));
    }

    let user = await User.findOne({ where: { email } });

    if (user && user.is_email_verified) {
      return errorResponse(res, getErrorCode(errorName.CONFLICT_EMAIL));
    }

    if (user && !user.is_email_verified) {
      await user.update({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        password_hash: passwordHash,
        fcm_token: fcmToken,
        device_token: token || null,
        email_verification_otp: emailOtp,
        email_verification_otp_expires_at: emailOtpExpiry,
        metadata
      });
    } else {
      user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        password_hash: passwordHash,
        fcm_token: fcmToken,
        device_token: token || null,
        is_email_verified: false,
        email_verification_otp: emailOtp,
        email_verification_otp_expires_at: emailOtpExpiry,
        metadata
      });
    }

    sendOtpForNow("SIGNUP_EMAIL_VERIFY", email, emailOtp);

    return successResponse(
      res,
      successName.SIGNUP,
      {
        data: {
          user: sanitizeUser(user)
        },
        ...getOtpResponse(emailOtp)
      },
      201
    );
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return errorResponse(res, getErrorCode(errorName.CONFLICT));
    }

    console.error("signup error", error);
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const User = getUserModel();
    if (!User) {
      return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
    }

    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return errorResponse(res, getErrorCode(errorName.NOTFOUND));
    }

    if (user.is_email_verified) {
      return errorResponse(res, getErrorCode(errorName.ALREADYVERIFIED));
    }

    if (!user.email_verification_otp || user.email_verification_otp !== otp) {
      return errorResponse(res, getErrorCode(errorName.INVALIDOTP));
    }

    if (!user.email_verification_otp_expires_at || new Date() > user.email_verification_otp_expires_at) {
      return errorResponse(res, getErrorCode(errorName.OTPEXPIRED));
    }

    await user.update({
      is_email_verified: true,
      email_verification_otp: null,
      email_verification_otp_expires_at: null
    });

    return successResponse(
      res,
      successName.EMAILVERIFIED,
      {
        data: {
          user: sanitizeUser(user)
        }
      },
      200
    );
  } catch (error) {
    console.error("verifyEmailOtp error", error);
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const resendEmailOtp = async (req, res) => {
  try {
    const User = getUserModel();
    if (!User) {
      return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
    }

    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return errorResponse(res, getErrorCode(errorName.NOTFOUND));
    }

    if (user.is_email_verified) {
      return errorResponse(res, getErrorCode(errorName.ALREADYVERIFIED));
    }

    const otp = generateOtp();
    await user.update({
      email_verification_otp: otp,
      email_verification_otp_expires_at: getOtpExpiryDate(OTP_TTL_MINUTES)
    });

    sendOtpForNow("RESEND_EMAIL_VERIFY", email, otp);

    return successResponse(
      res,
      successName.OTPSENT,
      {
        data: { email },
        ...getOtpResponse(otp)
      },
      200
    );
  } catch (error) {
    console.error("resendEmailOtp error", error);
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const login = async (req, res) => {
  try {
    const User = getUserModel();
    if (!User) {
      return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
    }

    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const fcmToken = req.body.fcm_token;
    const deviceToken = req.body.token;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return errorResponse(res, getErrorCode(errorName.UNAUTHORIZED));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return errorResponse(res, getErrorCode(errorName.UNAUTHORIZED));
    }

    if (!user.is_email_verified) {
      return errorResponse(res, getErrorCode(errorName.FORBIDDEN));
    }

    const { accessSecret, refreshSecret, accessExpiresIn, refreshExpiresIn } = getAuthSecrets();

    const accessToken = jwt.sign({ id: user.id, email: user.email }, accessSecret, {
      expiresIn: accessExpiresIn
    });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, refreshSecret, {
      expiresIn: refreshExpiresIn
    });

    await user.update({
      refresh_token: refreshToken,
      last_login_at: new Date(),
      ...(fcmToken ? { fcm_token: fcmToken } : {}),
      ...(deviceToken ? { device_token: deviceToken } : {})
    });

    return successResponse(
      res,
      successName.LOGIN,
      {
        data: {
          user: sanitizeUser(user),
          access_token: accessToken,
          refresh_token: refreshToken
        }
      },
      200
    );
  } catch (error) {
    console.error("login error", error);
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const forgotPassword = async (req, res) => {
  try {
    const User = getUserModel();
    if (!User) {
      return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
    }

    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return successResponse(
        res,
        successName.OTPSENT,
        { data: { email } },
        200
      );
    }

    const otp = generateOtp();
    await user.update({
      password_reset_otp: otp,
      password_reset_otp_expires_at: getOtpExpiryDate(OTP_TTL_MINUTES)
    });

    sendOtpForNow("FORGOT_PASSWORD", email, otp);

    return successResponse(
      res,
      successName.OTPSENT,
      {
        data: { email },
        ...getOtpResponse(otp)
      },
      200
    );
  } catch (error) {
    console.error("forgotPassword error", error);
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const resetPassword = async (req, res) => {
  try {
    const User = getUserModel();
    if (!User) {
      return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
    }

    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const password = String(req.body.password || "");
    const confirmPassword = String(req.body.confirm_password || "");

    if (password !== confirmPassword) {
      return errorResponse(res, getErrorCode(errorName.PASSWORD_MISMATCH));
    }

    if (!isStrongPassword(password)) {
      return errorResponse(res, getErrorCode(errorName.WEAKPASSWORD));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, getErrorCode(errorName.NOTFOUND));
    }

    if (!user.password_reset_otp || user.password_reset_otp !== otp) {
      return errorResponse(res, getErrorCode(errorName.INVALIDOTP));
    }

    if (!user.password_reset_otp_expires_at || new Date() > user.password_reset_otp_expires_at) {
      return errorResponse(res, getErrorCode(errorName.OTPEXPIRED));
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await user.update({
      password_hash: passwordHash,
      password_reset_otp: null,
      password_reset_otp_expires_at: null,
      refresh_token: null
    });

    return successResponse(
      res,
      successName.PASSWORDRESET,
      { data: { email } },
      200
    );
  } catch (error) {
    console.error("resetPassword error", error);
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

module.exports = {
  signup,
  verifyEmailOtp,
  resendEmailOtp,
  login,
  forgotPassword,
  resetPassword
};
