const { createBot } = require("whatsapp-cloud-api");

(async () => {
  try {
    // replace the values below from the values you copied above
    const from = "102056232854880";
    const token =
      "EAAXY0iE7ZBEEBAD3pHsU9GPuSnZAmD7ZBhzJEuSa5ExvWwDR3As3LQnYc1dLaRkF37kSRvb5RyYU41WaSDE55G0ula0hbCNzDV7RqtVN3SNFcZBnvXuU1ZAEZBjilftJty74dVcrFkfSnV7PiEemPsUZChhfDemSPZCLatUSYK4n61PORNk2IlSWZCx9a7FZBugNa13ZAt73KwvwYVsQUAgFbrn";
    const to = "919646967716"; // your phone number without the leading '+'
    const webhookVerifyToken = "12345"; // use a random value, e.g. 'bju#hfre@iu!e87328eiekjnfw'

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
