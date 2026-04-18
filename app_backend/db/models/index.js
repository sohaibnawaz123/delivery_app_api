const { Sequelize, DataTypes } = require("sequelize");

const defineUserModel = require("./user");

let sequelize = null;
let models = {};

const shouldSyncSchema = () => {
  return String(process.env.DB_SYNC || "true") === "true";
};

const validateDbConfig = () => {
  const requiredKeys = ["DB_HOST", "DB_PORT", "DB_DATABASE", "DB_USER", "DB_DIALECT"];
  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing database env vars: ${missing.join(", ")}`);
  }
};

const initModels = () => {
  models.users = defineUserModel(sequelize, DataTypes);
};

const connectDb = async () => {
  if (sequelize) {
    return models;
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

  initModels();
  await sequelize.authenticate();
  console.log("Database connection established.");

  if (shouldSyncSchema()) {
    await sequelize.sync();
    console.log("Database schema synced.");
  }

  return models;
};

const getSequelize = () => sequelize;
const getModels = () => models;

module.exports = {
  Sequelize,
  connectDb,
  getSequelize,
  getModels
};
