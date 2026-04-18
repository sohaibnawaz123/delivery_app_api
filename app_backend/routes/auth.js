const express = require("express");

const authController = require("../controller/auth");
const {
  validateSignupPayload,
  validateLoginPayload,
  validateEmailOtpPayload,
  validateForgotPasswordPayload,
  validateResetPasswordPayload
} = require("../middleware/auth");

const router = express.Router();

router.post("/signup", validateSignupPayload, authController.signup);
router.post("/verify-email-otp", validateEmailOtpPayload, authController.verifyEmailOtp);
router.post("/resend-email-otp", validateForgotPasswordPayload, authController.resendEmailOtp);
router.post("/login", validateLoginPayload, authController.login);
router.post("/forgot-password", validateForgotPasswordPayload, authController.forgotPassword);
router.post("/reset-password", validateResetPasswordPayload, authController.resetPassword);

module.exports = router;
