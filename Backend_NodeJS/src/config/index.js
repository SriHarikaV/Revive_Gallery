const { config } = require("dotenv");
config();
const { PORT } = process.env;
const port = PORT || 8080;
const dbUri =
  "mongodb+srv://admin:admin@projectgallery.rbwfrho.mongodb.net/?retryWrites=true&w=majority"
const prefix = "/api";
module.exports = {
  port,
  dbUri,
  prefix,
};
