const chatHistory = require("../models/history");
const telegramChatHistory = require("../models/telegram-chat");

// Common function to get response data from the database
const getResponseData = async (model, userNumber) => {
  try {
    const response = await model.findOne({ userNumber });
    return response || false;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Common function to save response data to the database
const saveResponseData = async (model, userNumber, userName, text) => {
  try {
    const userExist = await getResponseData(model, userNumber);
    console.log(userExist, "userExist==>>>1234");
    if (!userExist) {
      const newResponseTable = new model({
        userNumber,
        userName,
        text: [`${userName}: ${text}\nAI\nHello ${userName}`],
      });
      const savedResponse = await newResponseTable.save();
      return savedResponse;
    } else {
      const now = new Date();
      const messageTimestamp = new Date(userExist?.updatedAt);
      const hoursDiff = Math.abs(now - messageTimestamp) / 6e4;
      console.log(hoursDiff, "hoursDiff==>>>>112");
      const updatedResponse =
        hoursDiff >= 2 ? await model.findOneAndUpdate({ userNumber }, { text: text[text.length - 1] }, { new: true }) : await model.findOneAndUpdate({ userNumber }, { text }, { new: true });
      console.log(updatedResponse, "updatedResponse++====>12345");
      return updatedResponse;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get response data for regular chat
const getChatResponseData = async (userNumber) => {
  return await getResponseData(chatHistory, userNumber);
};

// Save response data for regular chat
const saveChatResponseData = async (msg, text) => {
  const userNumber = msg.from;
  const userName = msg.name;
  return await saveResponseData(chatHistory, userNumber, userName, text);
};

// Get response data for Telegram chat
const getTelegramResponseData = async (userNumber) => {
  return await getResponseData(telegramChatHistory, userNumber);
};

// Save response data for Telegram chat
const saveTelegramResponseData = async (msg, text) => {
  const userNumber = msg.chat.id;
  const userName = msg.from.first_name;
  return await saveResponseData(telegramChatHistory, userNumber, userName, text);
};

module.exports = {
  getChatResponseData,
  saveChatResponseData,
  getTelegramResponseData,
  saveTelegramResponseData,
};
