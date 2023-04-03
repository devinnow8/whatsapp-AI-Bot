const chatHistory = require("../models/history");
const telegramChatHistory = require("../models/telegram-chat");
const getHistoriesResponse = async (req, model) => {
  try {
    const isResponse = await model.findOne({
      userNumber: req,
    });
    if (!isResponse) {
      return false;
    }
    return isResponse;
  } catch (error) {
    return error.message;
  }
};
const getResponseData = async (req, model = true) => {
  if (model) {
    getHistoriesResponse(req, chatHistory);
  } else {
    getHistoriesResponse(String(req), telegramChatHistory);
  }
};

const saveHistoriesResponse = async (msg, array, model) => {
  console.log(msg, "msgmsgmsgmsgmsg");
  try {
    const userDetails = model
      ? { from: msg.from, name: msg.name, text: msg.data.text, model: chatHistory }
      : { from: msg.from.id, name: msg.chat.first_name + " " + msg.chat.last_name, text: msg.text, model: telegramChatHistory };
    let userExist = await getResponseData(userDetails.from, model);

    console.log(userExist, "userExist==>>>1234");
    if (!userExist) {
      let newResponseTable = new userDetails.model({
        userNumber: userDetails.from,
        userName: userDetails.name,
        text: [`${userDetails.name}: ${userDetails.text}\nAI:Hello ${userDetails.name}`],
      });
      newResponseTable = newResponseTable.save();
      if (!newResponseTable) {
        return "not able to save";
      }
      return newResponseTable;
    } else {
      const now = new Date();
      const messageTimestamp = new Date(userExist?.updatedAt); // Replace with actual message timestamp
      // const hoursDiff = Math.abs(now - messageTimestamp) / 36e5;

      const hoursDiff = Math.abs(now - messageTimestamp) / 6e4;

      console.log(hoursDiff, "hoursDiff==>>>>112");

      if (hoursDiff >= 2) {
        console.log("Message is 1 hour or older");
        userExist = await userDetails.model.findOneAndUpdate({ userNumber: userDetails.from }, { text: array[array.length - 1] }, { new: true });
      } else {
        console.log("Message is less than 1 hour old");
        userExist = await userDetails.model.findOneAndUpdate({ userNumber: userDetails.from }, { text: array }, { new: true });
      }

      // userExist = await chatHistory.findOneAndUpdate({ userNumber: msg.from }, { text: array }, { new: true });
      console.log(userExist, "userExist++====>12345");
      return userExist;
    }
  } catch (error) {
    return error.message;
  }
};
const saveResponseData = async (msg, array, model = true) => {
  saveHistoriesResponse(msg, array, model);
};

module.exports = {
  getResponseData,
  saveResponseData,
};
