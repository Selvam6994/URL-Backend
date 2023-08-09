import express, { request, response } from "express";
import CROS from "cors";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { signUpUser } from "./signUpUser.js";
import { logInUser } from "./logInUser.js";
import { convertUrl } from "./convertUrl.js";
import { getUrlData } from "./getUrlData.js";
import { cilckCounts } from "./cilckCounts.js";
import * as dotenv from "dotenv";
dotenv.config();

export const app = express();

const PORT = 4000;
const MongoURL = "mongodb://localhost:27017";
export const client = new MongoClient(MongoURL);
await client.connect();
export let secretKey = "secretkey";
app.use(express.static("public"));
app.use(express.json());
app.use(CROS());

//bcrypt password
export async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

signUpUser();

logInUser();

convertUrl();

getUrlData();

cilckCounts();
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
