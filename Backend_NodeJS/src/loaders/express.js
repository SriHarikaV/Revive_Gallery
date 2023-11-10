const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const { prefix } = require("./../config/index.js");
const routes = require("./../api/routes/index.js");
const bodyParser = require("body-parser");
module.exports = function (app) {
  process.on("uncaughtException", async (error) => {
    console.log(error);
  });

  process.on("unhandledRejection", async (ex) => {
    console.log(ex);
  });

  app.enable("trust proxy");
  app.set("trust proxy", true);
  app.use(cors());
  app.use(express.json());

  // Parse URL-encoded form data
  app.use(express.urlencoded({ extended: false }));

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(compression());
  app.use(express.static("public"));
  app.disable("x-powered-by");
  app.disable("etag");

  app.use(prefix, routes);

  app.get("/", (_req, res) => {
    return res
      .status(200)
      .json({
        data: "Project is successfully working...",
      })
      .end();
  });

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Content-Security-Policy-Report-Only", "default-src: https:");
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT POST PATCH DELETE GET");
      return res.status(200).json({});
    }
    next();
  });

  app.use((_req, _res, next) => {
    const error = new Error("Endpoint could not find!");
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, _next) => {
    res.status(error.status || 500);
    let level = "External Error";
    if (error.status === 500) {
      level = "Server Error";
    } else if (error.status === 404) {
      level = "Client Error";
    }

    return res.json({
      resultMessage: {
        en: error.message,
      },
      level: level,
    });
  });
};
