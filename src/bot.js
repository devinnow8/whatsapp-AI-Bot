// openai.js
const { Configuration, OpenAIApi } = require("openai");

// Initialize the OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an OpenAI API instance with the configuration
const openai = new OpenAIApi(configuration);

// Define a helper function to remove consecutive colons from the response
const removeConsecutiveColons = (text) => {
  return text.replace(/:{2,}/g, ":");
};

// Define the main function to handle the OpenAI API response
const handleResponse = async (conCatString) => {
  // Call the OpenAI API to generate a response
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: conCatString,
    temperature: 0.05,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  // Log the raw response for debugging
  console.log("Raw response:", response.data.choices[0].text);

  // Remove consecutive colons from the response
  const formattedResponse = removeConsecutiveColons(response.data.choices[0].text);

  // Remove the first three characters (usually "Q: " or "A: ")
  const trimmedResponse = formattedResponse.slice(3).trim();

  // Log the formatted response for debugging
  console.log("Formatted response:", trimmedResponse);

  // Return the trimmed response
  return trimmedResponse;
};

// Export the handleResponse function for reuse
module.exports = { handleResponse };
