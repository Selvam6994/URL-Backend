import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { app, client, secretKey } from "./index.js";
import * as dotenv from "dotenv";
dotenv.config();

export function logInUser() {
  app.post("/logIn", async function (request, response) {
    const { email, password } = await request.body;
    const existingUser = await client
      .db("URL_Shortner")
      .collection("User Data")
      .findOne({ email: email});
    if (existingUser) {
      let storedPassword = existingUser.password;
      const passwordCheck = await bcrypt.compare(password, storedPassword);
      if (passwordCheck == true) {
        let token = jwt.sign({ id: existingUser._id }, secretKey);
        response
          .status(200)
          .send({ message: "Logged in successfully", token: token });
        
      }else{
        response.status(400).send({ message: "invalid credential" });
      }
    } else {
      response.status(400).send({ message: "invalid credential" });

    }
  });
}
