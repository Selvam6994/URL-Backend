import { request, response } from "express";
import { app, client, generateHashedPassword } from "./index.js";
import nodeMailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export function signUpUser() {
  app.post("/signUp", async function (request, response) {
    const { email, password, confirmPassword } = await request.body;
    const oldUserData = await client
      .db("URL_Shortner")
      .collection("User Data")
      .findOne({ email: email });
    if (oldUserData) {
      response
        .status(401)
        .send({ message: "Invalid Credentials try any other email" });
    } else if (email != "") {
      let randomNum = Math.random() * 100000;
      let otp = Math.floor(randomNum);
      const result = await client
        .db("URL_Shortner")
        .collection("OTP")
        .insertOne({
          email: email,
          otp: otp,
        });
      let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: "selvamyoor@gmail.com",
          pass: "cqolhnuxhduwtztr",
        },
      });

      let info = {
        from: "selvamyoor@gmail.com",
        to: email,
        subject: "Sign in URL Shortner app",
        text: " Hi there! Your one time password is " + otp,
      };
      transporter.sendMail(info, (err) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log("email sent successfully");
          response.status(201).send({ message: "email sent successfully" });
        }
      });

      let findOtp = await client.db("URL_Shortner").collection("OTP").findOne({
        email: email,
        otp: otp,
      });
      if (findOtp) {
        setTimeout(async () => {
          const deleteOTP = await client
            .db("URL_Shortner")
            .collection("OTP")
            .deleteOne({
              email: email,
              otp: otp,
            });
          
        }, 60000);
      }
    } else {
      response.send({ message: "enter valid email" });
    }
  });

  app.post("/signUp/otpVerification", async function (request, response) {
    const { email, otp } = await request.body;
    const storedOtp = await client
      .db("URL_Shortner")
      .collection("OTP")
      .findOne({ otp: otp });
    if (storedOtp) {
      response.status(200).send({ message: "OTP verified" });
      
    } else {
      response.status(400).send({ message: "invalid otp" });
    
    }
  });

  app.post("/signUp/:email", async function (request, response) {
    const { email } = request.params;
    const { password, confirmPassword } = await request.body;
    if (password == confirmPassword) {
      const hashedPassword = await generateHashedPassword(password);
      const userData = await client
        .db("URL_Shortner")
        .collection("User Data")
        .insertOne({
          email: email,
          password: hashedPassword,
        });
      response.status(200).send({ password: hashedPassword });
      const createUsers = await client
        .db("URL_Shortner_User_Accounts")
        .collection(email)
        .insertOne({});
    } else {
      response.status(400).send({ message: "password does not match" });
    }
  });
}
