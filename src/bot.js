const { Configuration, OpenAIApi } = require("openai");

function removeMultipleColons(str) {
  // Check if the string contains more than 2 consecutive colons
  const regex = /:{3,}/g;
  if (regex.test(str)) {
    // Replace all occurrences of more than 2 consecutive colons with a single colon
    str = str.replace(regex, ":");
    // Call the function recursively to check for additional occurrences
    return removeMultipleColons(str);
  } else {
    // If no additional occurrences are found, return the modified string
    return str;
  }
}

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
  console.log("response====>", response.data.choices[0]);
  const formattedResponse = removeMultipleColons(response.data.choices[0].text);
  return formattedResponse.slice(3).trim();
};

module.exports = { handleResponse };
