const { errorResponse, successResponse } = require("../utils/responseHandler");
const { errorName, successName } = require("../utils/constants");
const getErrorCode = require("../utils/error");

const orders = [];
let orderIdCounter = 1;

const listOrders = async (req, res) => {
  return successResponse(res, successName.SUCCESS, { data: orders }, 200);
};

const getOrderById = async (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return errorResponse(res, getErrorCode(errorName.NOTFOUND));
  }

  return successResponse(res, successName.SUCCESS, { data: order }, 200);
};

const createOrder = async (req, res) => {
  const { customer_name: customerName, pickup_address: pickupAddress, dropoff_address: dropoffAddress } = req.body;

  const newOrder = {
    id: orderIdCounter++,
    customer_name: customerName,
    pickup_address: pickupAddress,
    dropoff_address: dropoffAddress,
    status: "pending",
    created_at: new Date().toISOString()
  };

  orders.push(newOrder);

  return successResponse(res, successName.CREATED, { data: newOrder }, 201);
};

const updateOrderStatus = async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const validStatuses = ["pending", "assigned", "picked_up", "delivered", "cancelled"];
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return errorResponse(res, getErrorCode(errorName.NOTFOUND));
  }

  if (!status || !validStatuses.includes(status)) {
    return errorResponse(res, getErrorCode(errorName.BADREQUEST));
  }

  order.status = status;
  order.updated_at = new Date().toISOString();

  return successResponse(res, successName.SUCCESS, { data: order }, 200);
};

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};
