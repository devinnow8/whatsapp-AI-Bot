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
      // chatHistory
      //   .findOne({ userNumber: msg.from })
      //   .then((result) => {
      //     console.log(result, "result==>>");

      //     if (result) {
      //       console.log("Number already exists");
      //       return;
      //     } else {
      //       let newResponseTable = new chatHistory({
      //         userNumber: msg.from,
      //         userName: msg.name,
      //         // text: [`${msg.name}: ${msg.data.text}\nAI:Hello ${msg.name}`],
      //       });
      //       newResponseTable = newResponseTable.save();
      //       if (!newResponseTable) {
      //         return "not able to save";
      //       }
      //       return newResponseTable;
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    } else {
      userExist = await chatHistory.findOneAndUpdate({ userNumber: msg.from }, { text: array }, { new: true });
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
