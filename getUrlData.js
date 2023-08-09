import { app, client } from "./index.js";
import * as dotenv from "dotenv";
dotenv.config();

export function getUrlData() {
  app.get("/getHistory/:email", async function (request, response) {
    const { email } = request.params;
    const urlData = await client
      .db("URL_Shortner_User_Accounts")
      .collection(email)
      .find()
      .toArray();
    urlData.map(async (ele) => {
      if (ele.longUrl == undefined) {
        const deleteNull = await client
          .db("URL_Shortner_User_Accounts")
          .collection(email)
          .deleteOne(ele);

      }
    });
    response.send(urlData);
  });
}
