const express = require("express");
const router = express.Router();
const productCategoryController = require("../controller/productCategory");

// ✅ CREATE CATEGORY
router.post("/", productCategoryController.createCategory);

// ✅ GET ALL CATEGORIES
router.get("/", productCategoryController.getAllCategories);

// ✅ GET SINGLE CATEGORY
router.get("/:id", productCategoryController.getCategoryById);

// ✅ UPDATE CATEGORY
router.put("/:id", productCategoryController.updateCategory);

// ✅ DELETE CATEGORY
router.delete("/:id", productCategoryController.deleteCategory);

module.exports = router;