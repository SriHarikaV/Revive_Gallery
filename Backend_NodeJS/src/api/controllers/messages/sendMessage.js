const { ChatRoom } = require("../../../models/index.js");

// Decorator function to handle common error handling logic
const withErrorHandling = (originalFunction) => {
  return async (...args) => {
    try {
      return await originalFunction(...args);
    } catch (error) {
      console.error(error);
      return { error: "Internal server error." };
    }
  };
};

const sendMessage = async (req, res) => {
  const { sender, chatId, message } = req.body;

  try {
    const chat = await ChatRoom.updateOne(
      { _id: chatId },
      { $push: { conversation: { senderId: sender, message } } }
    );

    if (chat.nModified === 0) {
      // If no documents were modified, the chat room with the given ID doesn't exist
      return res.status(404).json({ error: "Chat room not found." });
    }

    res.status(200).json({ sender: sender });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const sendMessageSocket = async (body) => {
  const { sender, chatId, message } = body;
  const chat = await ChatRoom.updateOne(
    { _id: chatId },
    { $push: { conversation: { senderId: sender, message } } }
  );

  if (chat.nModified === 0) {
    // If no documents were modified, the chat room with the given ID doesn't exist
    return false;
  }

  return true;
};

const sendMessageWithHandling = withErrorHandling(sendMessage);

exports.sendMessage = sendMessageWithHandling;
exports.sendMessageSocket = sendMessageSocket;
