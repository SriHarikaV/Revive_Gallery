import mongoose from "mongoose";

import { dbUri } from "../config/index.js";

export default async () => {
  await mongoose
    .connect(dbUri)
    .then(() => {
      console.log("Mongodb Connection");
    })
    .catch((err) => {
      console.log(err);
    });
};
