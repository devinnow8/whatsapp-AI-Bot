require("dotenv").config();
const { createBot } = require("whatsapp-cloud-api");
const { handleResponse } = require("./bot");

const usersResponse = [];

const findUser = (user) => {
  return usersResponse.find((res) => res.userNumber === user);
};

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
      const userExist = findUser(msg.from);
      if (userExist) {
        try {
          // usersResponse.text.push(msg.data.text);
          const index = usersResponse.findIndex((item) => item.userNumber === msg.from);
          usersResponse[index].text.push(msg.data.text);
          // usersResponse.findIndex(user => user.userNumber === userExist.userNumber)
          let conCatString = usersResponse[index].text.join("\\n") + "\\n";

          //           let conCatString = '',
          //           usersResponse[index]?.text?.forEach((item) => {
          //     conCatString += item + "\\n";
          //   });

          const response = await handleResponse(conCatString);
          console.log(response, conCatString, "<===== response");

          await bot.sendText(msg.from, response);
        } catch (error) {
          console.log(error, "error===>");
        }
      } else {
        try {
          await bot.sendText(msg.from, `Hello ${msg.name}`);
          usersResponse.push({
            userNumber: msg.from,
            text: [msg.data.text],
          });
        } catch (error) {
          console.log(error, "error===>");
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
})();
