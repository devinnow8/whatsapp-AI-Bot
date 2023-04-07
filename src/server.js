const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const responseBot = require("./index");
const { dbConnect } = require("./DB/dbConnect");
const keepAlive = require("../alive");
const chatHistory = require("./models/history");
const { handleMsgBot } = require("./bot");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

dbConnect();

app.get("/privacy-policy", (req, res) => {
  res.sendFile(__dirname + "/privacy-policy.html");
});

app.post("/msg", async (req, res) => {
  const { userName, userNumber, text } = req.body;
  if (!userNumber) {
    return { success: false };
  }
  let newResponseTable = new chatHistory({
    userNumber: userNumber,
    userName: userName,
    text: [text],
  });
  try {
    let existingUser = await chatHistory.findOne({ userNumber: newResponseTable.userNumber });
    if (!existingUser) {
      newResponseTable.text = [];
      newResponseTable.save();
      res.send({ success: response });
    } else {
      const { response, messagesArr } = await handleMsgBot(existingUser, text);
      console.log("messagesArr: ", messagesArr);
      existingUser = await chatHistory.findOneAndUpdate({ userNumber: newResponseTable.userNumber }, { text: messagesArr }, { new: true });
      res.send({ success: response });
    }

    // res.send({ success: true,  });
  } catch (err) {
    return res.send({ success: false, err: err });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log("App listening at: ", port);
  responseBot(app);
  keepAlive();
});
