import { app, generateHashedPassword, client } from "./index.js";

export function resetPassword(params) {
  app.put("/:email/resetPassword", async function (request, reseponse) {
    const { email } = request.params;
    const { password, confirmPassword } = await request.body;
    if (password == confirmPassword) {
      const hashedPassword = await generateHashedPassword(password);
      let updatePassword = await client
        .db("URL_Shortner")
        .collection("User Data")
        .updateOne({ email: email }, { $set: { password: hashedPassword } });
      reseponse.status(200).send(updatePassword);
    }
  });
}
