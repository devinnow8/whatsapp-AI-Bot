const chatHistory = require("../models/history");

// const getResponseData = async (req, res, next) => {
//   try {
//     const isResponse = await chatHistory.findOne({
//       userNumber: req,
//     });
//     if (!isResponse) {
//       return false;
//     }
//     return isResponse;
//   } catch (error) {
//     return error.message;
//   }
// };

const saveResponseData = (msg) => {
  // try {
  // let userExist = await getResponseData(msg.from);
  // if (!userExist) {
  let newResponseTable = new chatHistory({
    userNumber: msg.from,
    userName: msg.name,
    // text: [`${msg.name}: ${msg.data.text}\nAI:Hello ${msg.name}`],
  });
  newResponseTable = newResponseTable.save();
  if (!newResponseTable) {
    return "not able to save";
  }
  return newResponseTable;
  // }
  // else {
  //   userExist = await chatHistory.findOneAndUpdate({ userNumber: msg.from }, array);
  //   return userExist;
  // }
  // }
  // catch (error) {
  //   return error.message;
  // }
};

module.exports = {
  // getResponseData,
  saveResponseData,
};
