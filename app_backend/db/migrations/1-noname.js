'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "product_categories", deps: []
 * createTable "users", deps: []
 * createTable "products", deps: [product_categories]
 * createTable "product_images", deps: [products]
 * createTable "product_reviews", deps: [products, users]
 * createTable "product_variants", deps: [products]
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2026-04-22T12:05:23.014Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "product_categories",
            {
                "id": {
                    "type": Sequelize.BIGINT,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "category_name": {
                    "type": Sequelize.STRING(100),
                    "field": "category_name",
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.TEXT,
                    "field": "description"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "type": Sequelize.BIGINT,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "first_name": {
                    "type": Sequelize.STRING(80),
                    "field": "first_name",
                    "allowNull": false
                },
                "last_name": {
                    "type": Sequelize.STRING(80),
                    "field": "last_name",
                    "allowNull": false
                },
                "email": {
                    "type": Sequelize.STRING(150),
                    "field": "email",
                    "unique": true,
                    "allowNull": false
                },
                "phone_number": {
                    "type": Sequelize.STRING(25),
                    "field": "phone_number",
                    "unique": true,
                    "allowNull": false
                },
                "password_hash": {
                    "type": Sequelize.STRING,
                    "field": "password_hash",
                    "allowNull": false
                },
                "fcm_token": {
                    "type": Sequelize.TEXT,
                    "field": "fcm_token",
                    "allowNull": false
                },
                "device_token": {
                    "type": Sequelize.TEXT,
                    "field": "device_token",
                    "allowNull": true
                },
                "refresh_token": {
                    "type": Sequelize.TEXT,
                    "field": "refresh_token",
                    "allowNull": true
                },
                "is_email_verified": {
                    "type": Sequelize.BOOLEAN,
                    "field": "is_email_verified",
                    "defaultValue": false,
                    "allowNull": false
                },
                "email_verification_otp": {
                    "type": Sequelize.STRING(6),
                    "field": "email_verification_otp",
                    "allowNull": true
                },
                "email_verification_otp_expires_at": {
                    "type": Sequelize.DATE,
                    "field": "email_verification_otp_expires_at",
                    "allowNull": true
                },
                "password_reset_otp": {
                    "type": Sequelize.STRING(6),
                    "field": "password_reset_otp",
                    "allowNull": true
                },
                "password_reset_otp_expires_at": {
                    "type": Sequelize.DATE,
                    "field": "password_reset_otp_expires_at",
                    "allowNull": true
                },
                "last_login_at": {
                    "type": Sequelize.DATE,
                    "field": "last_login_at",
                    "allowNull": true
                },
                "metadata": {
                    "type": Sequelize.JSON,
                    "field": "metadata",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "products",
            {
                "id": {
                    "type": Sequelize.BIGINT,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "product_name": {
                    "type": Sequelize.STRING(120),
                    "field": "product_name",
                    "allowNull": false
                },
                "product_category_id": {
                    "type": Sequelize.BIGINT,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "product_categories",
                        "key": "id"
                    },
                    "field": "product_category_id",
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.TEXT,
                    "field": "description"
                },
                "short_description": {
                    "type": Sequelize.STRING(255),
                    "field": "short_description"
                },
                "base_price": {
                    "type": Sequelize.DECIMAL(10, 2),
                    "field": "base_price",
                    "allowNull": false
                },
                "status": {
                    "type": Sequelize.ENUM('active', 'inactive'),
                    "field": "status",
                    "defaultValue": "active"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "product_images",
            {
                "id": {
                    "type": Sequelize.BIGINT,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "product_id": {
                    "type": Sequelize.BIGINT,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "products",
                        "key": "id"
                    },
                    "field": "product_id",
                    "allowNull": false
                },
                "image_url": {
                    "type": Sequelize.TEXT,
                    "field": "image_url",
                    "allowNull": false
                },
                "is_primary": {
                    "type": Sequelize.BOOLEAN,
                    "field": "is_primary",
                    "defaultValue": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "product_reviews",
            {
                "id": {
                    "type": Sequelize.BIGINT,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "product_id": {
                    "type": Sequelize.BIGINT,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "products",
                        "key": "id"
                    },
                    "field": "product_id",
                    "allowNull": false
                },
                "user_id": {
                    "type": Sequelize.BIGINT,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "field": "user_id",
                    "allowNull": false
                },
                "rating": {
                    "type": Sequelize.DECIMAL(2, 1),
                    "field": "rating",
                    "allowNull": false
                },
                "review": {
                    "type": Sequelize.TEXT,
                    "field": "review"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "product_variants",
            {
                "id": {
                    "type": Sequelize.BIGINT,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "product_id": {
                    "type": Sequelize.BIGINT,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "products",
                        "key": "id"
                    },
                    "field": "product_id",
                    "allowNull": false
                },
                "size": {
                    "type": Sequelize.STRING(50),
                    "field": "size",
                    "allowNull": true
                },
                "color": {
                    "type": Sequelize.STRING(50),
                    "field": "color",
                    "allowNull": true
                },
                "material": {
                    "type": Sequelize.STRING(50),
                    "field": "material",
                    "allowNull": true
                },
                "price": {
                    "type": Sequelize.DECIMAL(10, 2),
                    "field": "price",
                    "allowNull": false
                },
                "stock": {
                    "type": Sequelize.INTEGER,
                    "field": "stock",
                    "defaultValue": 0
                },
                "sku": {
                    "type": Sequelize.STRING(100),
                    "field": "sku",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
