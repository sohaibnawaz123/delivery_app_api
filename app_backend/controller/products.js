const {
  products,
  productVariants,
  productReviews,
  productCategories,
  sequelize
} = require("../db/models");

const { Op } = require("sequelize");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { errorName } = require("../utils/constants");
const getErrorCode = require("../utils/error");

const extractProductData = (payload = {}) => {
  const data = {};

  if (payload.product_name !== undefined) {
    data.product_name = payload.product_name;
  }

  if (payload.product_category_id !== undefined) {
    data.product_category_id = payload.product_category_id;
  }

  const description =
    payload.description !== undefined ? payload.description : payload.product_description;
  if (description !== undefined) {
    data.description = description;
  }

  const shortDescription =
    payload.short_description !== undefined
      ? payload.short_description
      : payload.product_short_description;
  if (shortDescription !== undefined) {
    data.short_description = shortDescription;
  }

  const basePrice = payload.base_price !== undefined ? payload.base_price : payload.price;
  if (basePrice !== undefined) {
    data.base_price = basePrice;
  }

  if (payload.status !== undefined) {
    data.status = payload.status;
  }

  return data;
};

const getVariantSource = (payload = {}) => {
  if (payload.productVariants !== undefined) {
    return {
      key: "productVariants",
      value: payload.productVariants,
      provided: true
    };
  }

  if (payload.productDetails !== undefined) {
    return {
      key: "productDetails",
      value: payload.productDetails,
      provided: true
    };
  }

  return {
    key: null,
    value: null,
    provided: false
  };
};

const extractVariants = (payload = {}, fallbackPrice, fallbackStock) => {
  const source = getVariantSource(payload);

  if (!source.provided) {
    return { variants: null };
  }

  if (!Array.isArray(source.value)) {
    return {
      error: {
        statusCode: 400,
        message: `${source.key} must be an array.`
      }
    };
  }

  const variants = source.value.map((item) => {
    const variant = item && typeof item === "object" ? item : {};

    return {
      size: variant.size ?? null,
      color: variant.color ?? null,
      material: variant.material ?? null,
      sku: variant.sku ?? null,
      price: variant.price ?? fallbackPrice,
      stock: variant.stock ?? variant.stock_quantity ?? fallbackStock ?? 0
    };
  });

  const hasMissingPrice = variants.some((item) => item.price === undefined || item.price === null);
  if (hasMissingPrice) {
    return {
      error: {
        statusCode: 400,
        message: "Each variant requires a price, or provide top-level price/base_price."
      }
    };
  }

  return { variants };
};

const buildErrorResponse = (error) => {
  if (error && Number.isInteger(error.statusCode) && error.message) {
    return error;
  }

  if (error && error.name === "SequelizeValidationError") {
    return {
      statusCode: 400,
      message: error.errors?.[0]?.message || "Invalid request payload."
    };
  }

  if (error && error.name === "SequelizeForeignKeyConstraintError") {
    return {
      statusCode: 400,
      message: "Invalid product_category_id."
    };
  }

  return {
    statusCode: 500,
    message: error?.message || getErrorCode(errorName.INTERNALSERVER).message
  };
};

exports.createProduct = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const productData = extractProductData(req.body);
    const { variants, error: variantError } = extractVariants(
      req.body,
      productData.base_price,
      req.body.stock_quantity
    );

    if (variantError) {
      await transaction.rollback();
      return errorResponse(res, variantError);
    }

    if (!productData.product_name || !productData.product_category_id || productData.base_price === undefined) {
      await transaction.rollback();
      return errorResponse(res, {
        statusCode: 400,
        message: "product_name, product_category_id and price/base_price are required."
      });
    }

    const categoryExists = await productCategories.findByPk(productData.product_category_id, {
      transaction
    });
    if (!categoryExists) {
      await transaction.rollback();
      return errorResponse(res, {
        statusCode: 404,
        message: "Product category not found."
      });
    }

    const product = await products.create(productData, { transaction });

    if (variants && variants.length > 0) {
      const variantRows = variants.map((item) => ({
        ...item,
        product_id: product.id
      }));

      await productVariants.bulkCreate(variantRows, { transaction });
    }

    await transaction.commit();

    const createdProduct = await products.findByPk(product.id, {
      include: [
        {
          model: productVariants,
          as: "variants"
        },
        {
          model: productCategories,
          as: "category"
        }
      ]
    });

    return successResponse(res, "Product created successfully", { data: createdProduct }, 201);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    return errorResponse(res, buildErrorResponse(error));
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const limit = 10;
    const { cursor } = req.query;

    const whereCondition = {};
    if (cursor) {
      whereCondition.id = {
        [Op.lt]: cursor
      };
    }

    const data = await products.findAll({
      where: whereCondition,
      include: [
        {
          model: productVariants,
          as: "variants"
        },
        {
          model: productCategories,
          as: "category"
        }
      ],
      order: [["id", "DESC"]],
      limit: limit + 1
    });

    let nextCursor = null;
    if (data.length > limit) {
      const nextItem = data.pop();
      nextCursor = nextItem.id;
    }

    return successResponse(res, "Products fetched successfully", {
      data,
      nextCursor
    });
  } catch (error) {
    return errorResponse(res, buildErrorResponse(error));
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await products.findByPk(id, {
      include: [
        {
          model: productVariants,
          as: "variants"
        },
        {
          model: productReviews,
          as: "reviews"
        },
        {
          model: productCategories,
          as: "category"
        }
      ]
    });

    if (!product) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Product not found."
      });
    }

    return successResponse(res, "Product fetched successfully", { data: product });
  } catch (error) {
    return errorResponse(res, buildErrorResponse(error));
  }
};

exports.updateProduct = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const product = await products.findByPk(id, { transaction });

    if (!product) {
      await transaction.rollback();
      return errorResponse(res, {
        statusCode: 404,
        message: "Product not found."
      });
    }

    const productData = extractProductData(req.body);
    const fallbackPrice = productData.base_price !== undefined ? productData.base_price : product.base_price;
    const { variants, error: variantError } = extractVariants(
      req.body,
      fallbackPrice,
      req.body.stock_quantity
    );

    if (variantError) {
      await transaction.rollback();
      return errorResponse(res, variantError);
    }

    if (Object.keys(productData).length > 0) {
      await product.update(productData, { transaction });
    }

    if (variants !== null) {
      await productVariants.destroy({
        where: { product_id: id },
        transaction
      });

      if (variants.length > 0) {
        const variantRows = variants.map((item) => ({
          ...item,
          product_id: id
        }));

        await productVariants.bulkCreate(variantRows, { transaction });
      }
    }

    await transaction.commit();

    return successResponse(res, "Product updated successfully");
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    return errorResponse(res, buildErrorResponse(error));
  }
};

exports.deleteProduct = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const product = await products.findByPk(id, { transaction });

    if (!product) {
      await transaction.rollback();
      return errorResponse(res, {
        statusCode: 404,
        message: "Product not found."
      });
    }

    await productVariants.destroy({
      where: { product_id: id },
      transaction
    });

    await product.destroy({ transaction });
    await transaction.commit();

    return successResponse(res, "Product deleted successfully");
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    return errorResponse(res, buildErrorResponse(error));
  }
};
