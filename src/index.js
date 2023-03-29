const { createBot } = require("whatsapp-cloud-api");

(async () => {
  try {
    // replace the values below from the values you copied above
    const from = "102056232854880";
    const token =
      "EAAXY0iE7ZBEEBALZC7Sjngwvmg5IgFjTYMjut4V3DcHN3nYBN8bn2M05enUcxGhRNDfliSeDJzDJbbwa1ZCJUguo1ljwdmUy7q6yzgjNb5wr99FdnrfrGtsc2rl5XXKRsFabY0sv4GqTXesPCrCAbvGSQpZC3ZBAOJZCl4oWUxGdpstRs9Vv1Abw05SiF1U1881X2iSDsIfdNO2s0sC7KV";
    const to = "919646967716"; // your phone number without the leading '+'
    const webhookVerifyToken = "12345"; // use a random value, e.g. 'bju#hfre@iu!e87328eiekjnfw'

    const bot = createBot(from, token);

    // const result = await bot.sendText(to, "Hello world");
    const result = await bot.sendTemplate(to, "hello_world", "en_US");

    // Start express server to listen for incoming messages
    await bot.startExpressServer({
      webhookVerifyToken,
    });

    // Listen to ALL incoming messages
    bot.on("message", async (msg) => {
      console.log(msg);

      if (msg.type === "text") {
        await bot.sendText(msg.from, "Received your text message!");
      } else if (msg.type === "image") {
        await bot.sendText(msg.from, "Received your image!");
      }
    });
  } catch (err) {
    console.log(err);
  }
})();
