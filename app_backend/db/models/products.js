module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define(
    "products",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      product_name: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      product_category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      product_description: DataTypes.STRING(255),
      product_short_description: DataTypes.STRING(255),
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "products",
      underscored: true,
      timestamps: true,
    }
  );

  products.associate = (models) => {
    products.hasOne(models.productDetails, {
      foreignKey: "product_id",
      as: "productDetails",
    });

    products.hasMany(models.productReviews, {
      foreignKey: "product_id",
      as: "reviews",
    });

    products.belongsTo(models.productCategories, {
      foreignKey: "product_category_id",
      as: "category",
    });
  };

  return products;
};