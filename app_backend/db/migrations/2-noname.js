'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "product_category" from table "products"
 * addColumn "product_category_id" to table "products"
 *
 **/

var info = {
    "revision": 2,
    "name": "noname",
    "created": "2026-04-22T07:35:01.120Z",
    "comment": ""
};

var migrationCommands = [{
    // No migration steps needed. Both removeColumn and addColumn are obsolete after fixing the initial migration.
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize) {
        // No migration steps needed.
        return Promise.resolve();
    },
    info: info
};
