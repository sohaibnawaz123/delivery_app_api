const { errorResponse } = require("../utils/responseHandler");
const { errorName } = require("../utils/constants");
const getErrorCode = require("../utils/error");

const validateCreateOrder = (req, res, next) => {
  const { customer_name: customerName, pickup_address: pickupAddress, dropoff_address: dropoffAddress } = req.body;

  if (!customerName || !pickupAddress || !dropoffAddress) {
    return errorResponse(res, getErrorCode(errorName.BADREQUEST));
  }

  return next();
};

module.exports = {
  validateCreateOrder
};
