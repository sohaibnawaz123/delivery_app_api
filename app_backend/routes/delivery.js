const express = require("express");

const deliveryController = require("../controller/delivery");
const { validateCreateOrder } = require("../middleware/middleware");

const router = express.Router();

router.get("/orders", deliveryController.listOrders);
router.get("/orders/:id", deliveryController.getOrderById);
router.post("/orders", validateCreateOrder, deliveryController.createOrder);
router.patch("/orders/:id/status", deliveryController.updateOrderStatus);

module.exports = router;
