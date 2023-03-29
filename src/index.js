require("dotenv").config();
const { createBot } = require("whatsapp-cloud-api");

(async () => {
  try {
    // replace the values below from the values you copied above
    const from = process.env.FROM,
      token = process.env.TOKEN,
      to = process.env.TO, // your phone number without the leading '+'
      webhookVerifyToken = process.env.WEBHOOKVERIFYTOKEN; // use a random value, e.g. 'bju#hfre@iu!e87328eiekjnfw'

    const bot = createBot(from, token);

    // const result = await bot.sendText(to, "Hello world");
    // const result = await bot.sendTemplate(to, "hello_world", "en_US");

    // Start express server to listen for incoming messages
    await bot.startExpressServer({
      webhookVerifyToken,
    });

    // Listen to ALL incoming messages
    bot.on("message", async (msg) => {
      console.log(msg);

      try {
        await bot.sendText(msg.from, "Received your text message!");
      } catch (error) {
        console.log(error, "error===>");
      }
    });
  } catch (err) {
    console.log(err);
  }
})();
