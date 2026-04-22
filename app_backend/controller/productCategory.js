const { productCategories, products } = require("../db/models");


// ✅ CREATE CATEGORY
exports.createCategory = async (req, res) => {
    try {
        const { category_name, description } = req.body;

        const category = await productCategories.create({
            category_name,
            description,
        });

        res.status(201).json({
            success: true,
            data: category,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
    try {
        const data = await productCategories.findAll({
            include: [
                {
                    model: products,
                    as: "products",
                    attributes: ["id", "product_name", "price"],
                },
            ],
            order: [["id", "DESC"]],
        });

        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ GET SINGLE CATEGORY
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await productCategories.findByPk(id, {
            include: [
                {
                    model: products,
                    as: "products",
                },
            ],
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(category);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await productCategories.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.update(req.body);

        res.json({
            success: true,
            data: category,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await productCategories.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // ⚠️ optional: prevent delete if products exist
        const relatedProducts = await products.count({
            where: { product_category_id: id },
        });

        if (relatedProducts > 0) {
            return res.status(400).json({
                message: "Cannot delete category with existing products",
            });
        }

        await category.destroy();

        res.json({
            success: true,
            message: "Category deleted successfully",
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};