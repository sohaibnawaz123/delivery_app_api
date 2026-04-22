module.exports = (sequelize, DataTypes) => {
  const productVariants = sequelize.define(
    "product_variants",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      material: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      sku: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "product_variants",
      timestamps: true,
      underscored: true,
    }
  );

  productVariants.associate = (models) => {
    productVariants.belongsTo(models.products, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return productVariants;
};