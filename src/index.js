require("dotenv").config();
const { saveResponseData, getResponseData } = require("./controllers/api");
const { dbConnect } = require("./DB/dbConnect");
const { createBot } = require("whatsapp-cloud-api");
const { handleResponse } = require("./bot");
const TelegramBot = require("node-telegram-bot-api");
const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

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
      let userExist = await getResponseData(msg.from, true);
      let messagesArr;
      if (userExist) {
        try {
          messagesArr = userExist.text;
          if (messagesArr.length > 5) {
            messagesArr.splice(0, 1);
          }
          messagesArr.push(`${msg.name}:${msg.data.text}`);

          try {
            let conCatString = messagesArr.join("\\n") + "\\n";
            const response = await handleResponse(conCatString);
            console.log(response, "response==>check");
            messagesArr.splice(messagesArr.length - 1, 1, messagesArr[messagesArr.length - 1] + `\nAI\n${response}`);
            await bot.sendText(msg.from, response, { preview_url: true });
          } catch (error) {
            await bot.sendText(msg.from, `Sorry we can't proceed your request`);
          }
        } catch (error) {
          console.error(error, "error===>");
          await bot.sendText(msg.from, `Sorry we can't proceed your request`);
        }
      } else {
        try {
          await bot.sendText(msg.from, `Hello ${msg.name}`);
          saveResponseData({ msg: msg, model: true });
        } catch (error) {
          console.error(error, "error===>");
        }
      }
      saveResponseData({ msg: msg, array: messagesArr, model: true });
    });

    // Listen to ALL incoming telegram messages
    telegramBot.on("message", async (msg) => {
      console.log(msg, "msg===>>", telegramBot);
      let userExist = await getResponseData(String(msg.chat.id), false);
      let fullName = msg.chat.first_name;
      let messagesArr;
      if (userExist) {
        try {
          messagesArr = userExist.text;
          if (messagesArr.length > 5) {
            messagesArr.splice(0, 1);
          }
          messagesArr.push(`${fullName}:${msg.text}`);

          try {
            let conCatString = messagesArr.join("\\n") + "\\n";
            const response = await handleResponse(conCatString);
            console.log(response, "response==>check");
            messagesArr.splice(messagesArr.length - 1, 1, messagesArr[messagesArr.length - 1] + `\nAI\n${response}`);
            await telegramBot.sendMessage(msg.chat.id, response);
          } catch (error) {
            await telegramBot.sendMessage(msg.chat.id, `Sorry we can't proceed your request`);
          }
        } catch (error) {
          console.error(error, "error===>");
          await telegramBot.sendMessage(msg.chat.id, `Sorry we can't proceed your request`);
        }
      } else {
        try {
          await telegramBot.sendMessage(msg.chat.id, `Hello ${fullName}`);
          saveResponseData({ msg: msg, model: true });
        } catch (error) {
          console.error(error, "error===>");
        }
      }
      saveResponseData({ msg: msg, array: messagesArr, model: true });

      // console.log(userExist, "userExist==>>");
      // telegramBot.sendMessage(msg.chat.id, `Hi ${fullName}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
