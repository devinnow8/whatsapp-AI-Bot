const { Configuration, OpenAIApi } = require("openai");

const handleResponse = async (conCatString) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: conCatString,
    temperature: 0.05,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  let formattedResponse = response.data.choices[0].text;
  console.log("formattedResponse: ", formattedResponse);
  return formattedResponse;
};

const handleMsgBot = async (userExist, textMsg) => {
  let messagesArr = userExist.text;
  if (messagesArr.length > 5) {
    messagesArr.splice(0, 1);
  }
  messagesArr.push(`${userExist.userName}:${textMsg}`);

  let conCatString = messagesArr.join("\\n") + "AI: ? \\n";
  console.log("conCatString: ", conCatString);

  const response = await handleResponse(conCatString);
  console.log("response: ", response);
  messagesArr.splice(messagesArr.length - 1, 1, messagesArr[messagesArr.length - 1] + `\nAI:\n${response}`);

  return { response, messagesArr };
};

module.exports = { handleResponse, handleMsgBot };
