module.exports = (sequelize, DataTypes) => {
  const product_details = sequelize.define(
    "product_details",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
      },
      size: DataTypes.STRING(80),
      color: DataTypes.STRING(80),
      material: DataTypes.STRING(80),
    },
    {
      tableName: "product_details",
      underscored: true,
      timestamps: true,
    }
  );

  product_details.associate = (models) => {
    product_details.belongsTo(models.products, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return product_details;
};