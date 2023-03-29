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

  const data = [];
  data.push({
    text: response.data.choices[0].text,
  });

  //   setResponseAI(response.data.choices[0].text.split(":")[1]);
  return response.data.choices[0].text;
};

module.export = handleResponse;
