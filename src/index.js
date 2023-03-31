require("dotenv").config();
const { saveResponseData, getResponseData } = require("./controllers/api");
const { dbConnect } = require("./DB/dbConnect");
const { createBot } = require("whatsapp-cloud-api");
const { handleResponse } = require("./bot");

(async () => {
  await dbConnect();
  try {
    // replace the values below from the values you copied above
    const from = process.env.FROM,
      token = process.env.TOKEN,
      to = process.env.TO, // your phone number without the leading '+'
      webhookVerifyToken = process.env.WEBHOOKVERIFYTOKEN, // use a random value, e.g. 'bju#hfre@iu!e87328eiekjnfw'
      bot = createBot(from, token),
      // Start express server to listen for incoming messages
      { app } = await bot.startExpressServer({
        webhookVerifyToken,
      });

    app.get("/privacy-policy", (req, res) => {
      res.sendFile(__dirname + "/privacy-policy.html");
    });

    // Listen to ALL incoming messages
    bot.on("message", async (msg) => {
      console.log(msg);
      let userExist = await getResponseData(msg.from);
      let messagesArr;
      if (userExist) {
        try {
          messagesArr = userExist.text;
          if (messagesArr.length > 5) {
            messagesArr.splice(0, 1);
          }
          messagesArr.push(`${msg.name}:${msg.data.text}`);

          let conCatString = messagesArr.join("\\n") + "\\n";
          const response = await handleResponse(conCatString);
          messagesArr.splice(messagesArr.length - 1, 1, messagesArr[messagesArr.length - 1] + `\nAI:${response}`);
          await bot.sendText(msg.from, response, { preview_url: true });
        } catch (error) {
          console.error(error, "error===>");
        }
      } else {
        try {
          await bot.sendText(msg.from, `Hello ${msg.name}`);
          saveResponseData(msg);
        } catch (error) {
          console.error(error, "error===>");
        }
      }
      saveResponseData(msg, messagesArr);
    });
  } catch (err) {
    console.error(err);
    await bot.sendText(msg.from, `Sorry we can't proceed your request`);
  }
})();
