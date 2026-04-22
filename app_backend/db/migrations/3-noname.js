'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "description" on table "product_categories"
 * changeColumn "material" on table "product_details"
 * changeColumn "color" on table "product_details"
 * changeColumn "size" on table "product_details"
 * changeColumn "review" on table "product_reviews"
 * changeColumn "rating" on table "product_reviews"
 * changeColumn "stock_quantity" on table "products"
 * changeColumn "price" on table "products"
 * changeColumn "product_short_description" on table "products"
 * changeColumn "product_description" on table "products"
 *
 **/

var info = {
    "revision": 3,
    "name": "noname",
    "created": "2026-04-22T08:15:02.295Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "product_categories",
            "description",
            {
                "type": Sequelize.STRING(255),
                "field": "description"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "product_details",
            "material",
            {
                "type": Sequelize.STRING(80),
                "field": "material"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "product_details",
            "color",
            {
                "type": Sequelize.STRING(80),
                "field": "color"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "product_details",
            "size",
            {
                "type": Sequelize.STRING(80),
                "field": "size"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "product_reviews",
            "review",
            {
                "type": Sequelize.TEXT,
                "field": "review"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "product_reviews",
            "rating",
            {
                "type": Sequelize.DECIMAL(2, 1),
                "field": "rating",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "products",
            "stock_quantity",
            {
                "type": Sequelize.INTEGER,
                "field": "stock_quantity",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "products",
            "price",
            {
                "type": Sequelize.DECIMAL(10, 2),
                "field": "price",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "products",
            "product_short_description",
            {
                "type": Sequelize.STRING(255),
                "field": "product_short_description"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "products",
            "product_description",
            {
                "type": Sequelize.STRING(255),
                "field": "product_description"
            }
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
