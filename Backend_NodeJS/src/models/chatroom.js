const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  conversation: [
    {
      senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      message: {
        type: String,
        trim: true,
      },
    },
  ],
});

const ChatRoom = model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;
