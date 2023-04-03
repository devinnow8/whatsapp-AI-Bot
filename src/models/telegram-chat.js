const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const telegramChatHistorySchema = new Schema(
  {
    userNumber: { type: String, unique: true },
    text: { type: [String], required: true },
    userName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TelegramHistory", telegramChatHistorySchema);
