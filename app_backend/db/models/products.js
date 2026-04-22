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
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      product_category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      short_description: DataTypes.STRING(255),
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
    },
    {
      tableName: "products",
      timestamps: true,
      underscored: true,
    }
  );

  products.associate = (models) => {
    products.belongsTo(models.productCategories, {
      foreignKey: "product_category_id",
      as: "category",
    });

    products.hasMany(models.productVariants, {
      foreignKey: "product_id",
      as: "variants",
    });

    products.hasMany(models.productImages, {
      foreignKey: "product_id",
      as: "images",
    });

    products.hasMany(models.productReviews, {
      foreignKey: "product_id",
      as: "reviews",
    });
  };

  return products;
};