require("dotenv").config();
const { saveResponseData, getResponseData, telegramGetResponseData, telegramSaveResponseData } = require("./controllers/api");
const { dbConnect } = require("./DB/dbConnect");
const { createBot } = require("whatsapp-cloud-api");
const { handleResponse } = require("./bot");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_TOKEN;
const telegramBot = new TelegramBot(token, { polling: true });

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

    // Listen to ALL incoming whatsapp messages
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
          console.log(response, "response==>check");
          messagesArr.splice(messagesArr.length - 1, 1, messagesArr[messagesArr.length - 1] + `\nAI:${response}`);
          await bot.sendText(msg.from, response, { preview_url: true });
        } catch (error) {
          console.error(error, "error===>");
          await bot.sendText(msg.from, `Sorry we can't proceed your request`);
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

    // Listen to ALL incoming telegram messages
    telegramBot.on("message", async (msg) => {
      const chatId = String(msg.chat.id);
      console.log(msg, "msgmsgmsg", typeof chatId);
      // telegramBot.sendMessage(chatId, "Received your message: " + msg.text);

      let userExist = await telegramGetResponseData(chatId);
      let name = msg.from.first_name;
      let messagesArr;
      if (userExist) {
        try {
          messagesArr = userExist.text;
          if (messagesArr.length > 5) {
            messagesArr.splice(0, 1);
          }
          messagesArr.push(`${name}:${msg.text}`);

          let conCatString = messagesArr.join("\\n") + "\\n";
          const response = await handleResponse(conCatString);
          console.log(response, "response==>check");
          messagesArr.splice(messagesArr.length - 1, 1, messagesArr[messagesArr.length - 1] + `\nAI:${response}`);
          await telegramBot.sendMessage(chatId, response);
        } catch (error) {
          console.error(error, "error===>");
          await telegramBot.sendMessage(chatId, `Sorry we can't proceed your request`);
        }
      } else {
        try {
          await telegramBot.sendMessage(chatId, `Hello ${name}`);
          telegramSaveResponseData(msg);
        } catch (error) {
          console.error(error, "error===>");
        }
      }
      telegramSaveResponseData(msg, messagesArr);
    });
  } catch (err) {
    console.error(err);
  }
})();
