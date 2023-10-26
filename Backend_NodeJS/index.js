const express = require("express");
const loader = require("./src/loaders/index.js");
const app = express();

loader(app);

module.exports = app;
