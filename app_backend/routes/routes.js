const express = require("express");

const deliveryRoutes = require("./delivery");
const authRoutes = require("./auth");
const productRoutes = require("./products");
const categoryRoutes = require("./productCategory");


const router = express.Router();
router.use("/products", productRoutes);
router.use("/category", categoryRoutes);
router.use("/delivery", deliveryRoutes);
router.use("/auth", authRoutes);
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString()
    },
    message: "OK"
  });
});

module.exports = router;
