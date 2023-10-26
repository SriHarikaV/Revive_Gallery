const mongoose = require("mongoose");
const { dbUri } = require("../config/index.js");

module.exports = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("Mongodb Connection");
  } catch (err) {
    console.log(err);
  }
};
