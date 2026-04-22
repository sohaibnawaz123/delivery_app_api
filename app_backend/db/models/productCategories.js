module.exports = (sequelize, DataTypes) => {
    const product_categories = sequelize.define(
        "product_categories",
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            category_name: {
                type: DataTypes.STRING(80),
                allowNull: false,
            },
            description: DataTypes.STRING(255),
        },
        {
            tableName: "product_categories",
            underscored: true,
            timestamps: true,
        }
    );

    product_categories.associate = (models) => {
        product_categories.hasMany(models.products, {
            foreignKey: "product_category_id",
            as: "products",
        });
    };

    return product_categories;
};