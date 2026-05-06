
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "staging";
// Fix the path to config.js
const config = require(path.join(__dirname, "../../config/config.js"))[env];
const db = {};
let sequelize;

const isSequelizeModel = (candidate) => {
  return (
    candidate &&
    typeof candidate === "function" &&
    candidate.rawAttributes &&
    typeof candidate.getTableName === "function"
  );
};

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    var modelName = model.name.replace(/_([a-z])/g, (match, letter) =>
      letter.toUpperCase()
    );
    db[modelName] = model;
  });

const connectDb = async () => {
  if (sequelize) {
    return db;
  }

  validateDbConfig();

  sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      dialect: process.env.DB_DIALECT,
      logging: false
    }
  );

  // If you have a custom initModels, call it here, otherwise db is already populated
  await sequelize.authenticate();
  console.log("Database connection established.");

  if (shouldSyncSchema()) {
    await sequelize.sync();
    console.log("Database schema synced.");
  }

  return db;
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.models = Object.keys(db).reduce((models, key) => {
  if (isSequelizeModel(db[key])) {
    models[key] = db[key];
  }
  return models;
}, {});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.connectDb = connectDb;

// Provide getModels function for compatibility
const getModels = () => db.models;

module.exports = {
  ...db,
  getModels
};
// const { Sequelize, DataTypes } = require("sequelize");

// const defineUserModel = require("./users");

// let sequelize = null;
// let models = {};

// const shouldSyncSchema = () => {
//   return String(process.env.DB_SYNC || "true") === "true";
// };

// const validateDbConfig = () => {
//   const requiredKeys = ["DB_HOST", "DB_PORT", "DB_DATABASE", "DB_USER", "DB_DIALECT"];
//   const missing = requiredKeys.filter((key) => !process.env[key]);

//   if (missing.length > 0) {
//     throw new Error(`Missing database env vars: ${missing.join(", ")}`);
//   }
// };

// const initModels = () => {
//   models.users = defineUserModel(sequelize, DataTypes);
// };



// const getSequelize = () => sequelize;
// const getModels = () => models;

// module.exports = {
//   Sequelize,
//   connectDb,
//   getSequelize,
//   getModels
// };
