import { config } from "dotenv";
config();
const { PORT } = process.env;
export const port = PORT || 8080;
export const dbUri =
  "mongodb+srv://admin:admin@revive.p6okv5v.mongodb.net/?retryWrites=true&w=majority";
export const prefix = "/api";
