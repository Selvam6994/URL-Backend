import { app, client } from "./index.js";
import * as dotenv from "dotenv";
dotenv.config();

export function cilckCounts() {
  app.get("/:email/:urlCode", async function (request, response) {
    const urlCode = request.params.urlCode;
    const email = request.params.email;
    const storedData = await client
      .db("URL_Shortner_User_Accounts")
      .collection(email)
      .findOne({ urlCode });
    if (storedData) {
      let clicks = storedData.click;

      let noOfClicks = clicks + 1;
      const entry = await client
        .db("URL_Shortner_User_Accounts")
        .collection(email)
        .updateOne({ urlCode }, { $set: { click: noOfClicks } });
      response.status(200).redirect(storedData.longUrl);
    }
  });
}
