import { nanoid } from "nanoid";
import { app, client } from "./index.js";
import * as dotenv from "dotenv";
dotenv.config();

export function convertUrl() {
  app.post("/urlShortner/:email", async function (request, response) {
    const { email } = request.params;
    const { longUrl } = await request.body;
    const storedLongUrl = await client
      .db("URL_Shortner_User_Accounts")
      .collection(email)
      .findOne({ longUrl: longUrl });
    if (storedLongUrl) {
      response.status(400).send({ message: "url already converted" });
    } else {
      const urlCode = nanoid(10);
      const shortUrl = `http://localhost:4000/${email}/${urlCode}`;
      const { longUrl } = await request.body;
      const storeUrlData = await client
        .db("URL_Shortner_User_Accounts")
        .collection(email)
        .insertOne({
          longUrl: longUrl,
          shortUrl: shortUrl,
          urlCode: urlCode,
          click: 0,
        });
      response.send({ message: "url stored" });
  
  
    }
  });
}
