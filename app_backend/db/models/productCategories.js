module.exports = (sequelize, DataTypes) => {
    const productCategories = sequelize.define(
        "product_categories",
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            category_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: DataTypes.TEXT,
        },
        {
            tableName: "product_categories",
            timestamps: true,
            underscored: true,
        }
    );

    productCategories.associate = (models) => {
        productCategories.hasMany(models.products, {
            foreignKey: "product_category_id",
            as: "products",
        });
    };

    return productCategories;
};