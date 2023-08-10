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
import { forgotPasswordOtp } from "./forgotPasswordOtp.js";
import { otpVerification } from "./otpVerification.js";
import { resetPassword } from "./resetPassword.js";
dotenv.config();

export const app = express();

const PORT = 4000;
const MongoURL = process.env.MONGO_URL;
export const client = new MongoClient(MongoURL);
await client.connect();
export let secretKey = process.env.SECRET_KEY;
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

forgotPasswordOtp();

otpVerification();

resetPassword();
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
