require("dotenv").config();
const { saveResponseData, getResponseData, telegramGetResponseData, telegramSaveResponseData } = require("./controllers/api");
const { createBot } = require("whatsapp-cloud-api");
const { handleMsgBot } = require("./bot");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_TOKEN;
const telegramBot = new TelegramBot(token, { polling: true });

const responseBot = async (app) => {
  try {
    // replace the values below from the values you copied above
    const from = process.env.FROM;
    const token = process.env.TOKEN;
    const webhookVerifyToken = process.env.WEBHOOKVERIFYTOKEN; // use a random value, e.g. 'bju#hfre@iu!e87328eiekjnfw'

    const bot = createBot(from, token);

    // Start express server to listen for incoming messages
    await bot.startExpressServer({
      app,
      webhookVerifyToken,
    });

    // Listen to ALL incoming whatsapp messages
    bot.on("message", async (msg) => {
      console.log(msg, "Whatsapp msg");
      let userExist = await getResponseData(msg.from);
      if (userExist) {
        try {
          const { response, messagesArr } = await handleMsgBot(userExist, msg.data.text);
          console.log("response==>", response, "messagesArr==> whatsapp", messagesArr);
          await bot.sendText(msg.from, response, { preview_url: true });
          saveResponseData(msg, messagesArr);
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
    });

    // Listen to ALL incoming telegram messages
    telegramBot.on("message", async (msg) => {
      const chatId = String(msg.chat.id);
      console.log(msg, "telegram msg");

      let userExist = await telegramGetResponseData(chatId);
      let name = msg.from.first_name;
      if (userExist) {
        try {
          const { response, messagesArr } = await handleMsgBot(userExist, msg.text);
          console.log("response==>", response, "messagesArr==> telegram", messagesArr);
          await telegramBot.sendMessage(chatId, response);
          telegramSaveResponseData(msg, messagesArr);
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
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = responseBot;
