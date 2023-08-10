import nodeMailer from "nodemailer";
import { app, client } from "./index.js";

export function forgotPasswordOtp() {
  app.post("/forgotPassword", async function (request, response) {
    const { email } = await request.body;
    const oldUserData = await client
      .db("URL_Shortner")
      .collection("User Data")
      .findOne({ email: email });
    if (oldUserData) {
      let randomNum = Math.random() * 100000;
      let otp = Math.floor(randomNum);
      const result = await client.db("URL_Shortner").collection("OTP").insertOne({
        email: email,
        otp: otp,
      });
      let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: "selvamyoor@gmail.com",
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      let info = {
        from: "selvamyoor@gmail.com",
        to: email,
        subject: "Password reset for URL Shortner app",
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
      } else {
        response.send({ message: "OTP not found" });
      }
    } else {
      response
        .status(401)
        .send({ message: "Invalid Credentials try any other email" });
    }
  });
}
