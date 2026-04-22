module.exports = (sequelize, DataTypes) => {
    const productImages = sequelize.define(
        "product_images",
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
            image_url: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            is_primary: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: "product_images",
            timestamps: true,
            underscored: true,
        }
    );

    productImages.associate = (models) => {
        productImages.belongsTo(models.products, {
            foreignKey: "product_id",
            as: "product",
        });
    };

    return productImages;
};