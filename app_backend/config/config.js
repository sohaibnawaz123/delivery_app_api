const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const env = process.env.NODE_ENV || "local";
const absoluteEnvPath = path.resolve(__dirname, "..", "..", `.env.${env}`);

if (fs.existsSync(absoluteEnvPath)) {
  dotenv.config({ path: absoluteEnvPath });
} else {
  dotenv.config();
}

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  dialect: process.env.DB_DIALECT || "mysql",
  logging: false,
  pool: {
    max: 15,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
};

module.exports = {
  local: baseConfig,
  staging: baseConfig,
  production: baseConfig
};
