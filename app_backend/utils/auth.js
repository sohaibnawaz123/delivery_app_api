const crypto = require("crypto");

const normalizeEmail = (email) => {
  return String(email || "").trim().toLowerCase();
};

const generateOtp = () => {
  return String(crypto.randomInt(1000, 10000));
};

const getOtpExpiryDate = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

const isStrongPassword = (password) => {
  const value = String(password || "");
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  return regex.test(value);
};

module.exports = {
  normalizeEmail,
  generateOtp,
  getOtpExpiryDate,
  isStrongPassword
};
