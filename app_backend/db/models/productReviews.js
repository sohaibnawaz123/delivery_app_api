module.exports = (sequelize, DataTypes) => {
    const product_reviews = sequelize.define(
        "product_reviews",
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
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            rating: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: false,
            },
            review: DataTypes.TEXT,
        },
        {
            tableName: "product_reviews",
            underscored: true,
            timestamps: true,
        }
    );

    product_reviews.associate = (models) => {
        product_reviews.belongsTo(models.products, {
            foreignKey: "product_id",
            as: "product",
        });

        product_reviews.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "user",
        });
    };

    return product_reviews;
};