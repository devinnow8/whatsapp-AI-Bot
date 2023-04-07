// Import required modules
require("dotenv").config();
const { dbConnect } = require("./DB/dbConnect");
const { createBot } = require("whatsapp-cloud-api");
const TelegramBot = require("node-telegram-bot-api");
const { saveChatResponseData, getChatResponseData, getTelegramResponseData, saveTelegramResponseData } = require("./controllers/api");
const { handleResponse } = require("./bot");
const { keepAlive } = require("../alive");
const whatsappToken = process.env.TOKEN;
const from = process.env.FROM;
const to = process.env.TO;
const webhookVerifyToken = process.env.WEBHOOKVERIFYTOKEN;
const bot = createBot(from, whatsappToken);
// Set up Telegram bot
const telegramToken = process.env.TELEGRAM_TOKEN;
const telegramBot = new TelegramBot(telegramToken, { polling: true });

// Define common function to handle incoming messages
const handleMessage = async (msg, isTelegram) => {
  // Check if user exists in database
  let userExist = isTelegram ? await getTelegramResponseData(msg.chat.id) : await getChatResponseData(msg.from);
  let messagesArr;

  if (userExist) {
    try {
      messagesArr = userExist.text;

      // Limit message history to 5 messages
      if (messagesArr.length > 5) {
        messagesArr.splice(0, 1);
      }

      // Add new message to message history
      messagesArr.push(`${isTelegram ? msg.from.first_name : msg.name}:${isTelegram ? msg.text : msg.data.text}`);

      // Concatenate message history into a single string and pass to AI for processing
      let conCatString = messagesArr.join("\\n") + "\\n";
      const response = await handleResponse(conCatString);
      // Update last message in message history with AI response
      messagesArr.splice(messagesArr.length - 1, 1, messagesArr[messagesArr.length - 1] + `\nAI ${response}`);

      // Send AI response to user
      if (isTelegram) {
        await telegramBot.sendMessage(msg.chat.id, response);
        saveTelegramResponseData(msg, messagesArr);
      } else {
        await bot.sendText(msg.from, response, { preview_url: true });
        saveChatResponseData(msg, messagesArr);
      }
    } catch (error) {
      console.error(error, "error===>");

      // Send error message to user
      if (isTelegram) {
        await telegramBot.sendMessage(msg.chat.id, `Sorry we can't proceed your request`);
      } else {
        await bot.sendText(msg.from, `Sorry we can't proceed your request`);
      }
    }
  } else {
    try {
      // Send welcome message to new user
      if (isTelegram) {
        await telegramBot.sendMessage(msg.chat.id, `Hello ${msg.from.first_name}`);
        saveTelegramResponseData(msg);
      } else {
        await bot.sendText(msg.from, `Hello ${msg.name}`);
        saveChatResponseData(msg);
      }
    } catch (error) {
      console.error(error, "error===>");
    }
  }
};

// Set up WhatsApp bot
(async () => {
  await dbConnect();
  try {
    const { app } = await bot.startExpressServer({
      webhookVerifyToken,
    });

    // Set up privacy policy route
    app.get("/privacy-policy", (req, res) => {
      res.sendFile(__dirname + "/privacy-policy.html");
    });

    // Listen to incoming WhatsApp messages
    bot.on("message", async (msg) => {
      await handleMessage(msg, false);
    });

    //to keep render active
    keepAlive();

    // Listen to incoming Telegram messages
    telegramBot.on("message", async (msg) => {
      await handleMessage(msg, true);
    });
  } catch (err) {
    console.error(err);
  }
})();
