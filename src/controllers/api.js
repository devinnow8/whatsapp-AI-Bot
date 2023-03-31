const chatHistory = require("../models/history");

const getResponseData = async (req, res, next) => {
  try {
    const isResponse = await chatHistory.findOne({
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

const saveResponseData = async (msg, array) => {
  try {
    let userExist = await getResponseData(msg.from);
    console.log(userExist, "userExist==>>>1234");
    if (!userExist) {
      let newResponseTable = new chatHistory({
        userNumber: msg.from,
        userName: msg.name,
        text: [`${msg.name}: ${msg.data.text}\nAI:Hello ${msg.name}`],
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
        userExist = await chatHistory.findOneAndUpdate({ userNumber: msg.from }, { text: array[array.length - 1] }, { new: true });
      } else {
        console.log("Message is less than 1 hour old");
        userExist = await chatHistory.findOneAndUpdate({ userNumber: msg.from }, { text: array }, { new: true });
      }

      // userExist = await chatHistory.findOneAndUpdate({ userNumber: msg.from }, { text: array }, { new: true });
      console.log(userExist, "userExist++===>123");
      return userExist;
    }
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getResponseData,
  saveResponseData,
};
