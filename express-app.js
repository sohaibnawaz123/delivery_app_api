const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const app = express();

function setupApp() {
  app.use(
    rateLimit({
      windowMs: 2 * 60 * 1000,
      max: 200,
      message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
      }
    })
  );

  app.use(compression());
  app.use(cors({ origin: "*", credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
  app.use("/public", express.static(`${__dirname}/public`));

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error"
    });
  });
}

setupApp();

module.exports = app;
