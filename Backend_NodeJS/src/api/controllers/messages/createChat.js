const { ChatRoom } = require("../../../models/index.js");

const createChatRoomAPI = async (req, res) => {
  const { sender, message, receiver } = req.body;
  try {
    const chatExists = await ChatRoom.exists({
      buyer: sender,
      seller: receiver,
    });

    let chatRoom;

    if (chatExists) {
      // Chat room exists, find it and add the message
      chatRoom = await ChatRoom.findOne({ buyer: sender, seller: receiver });
    } else {
      // Chat room doesn't exist, create a new one
      chatRoom = await createRoom(sender, receiver);
    }

    // Add the message to the chat room
    await ChatRoom.updateOne(
      { _id: chatRoom._id },
      { $push: { conversation: { senderId: sender, message } } }
    );

    res.status(200).json({ messageId: chatRoom._id });
  } catch (error) {
    res.status(500).json(error);
  }
};

async function createRoom(buyer, seller) {
  let chatRoom = new ChatRoom({ buyer, seller });
  console.log(chatRoom);
  return await chatRoom.save();
}

const createChatRoom = async (body) => {
  const { sender, message, receiver } = body;
  try {
    const chatExists = await ChatRoom.exists({
      buyer: sender,
      seller: receiver,
    });

    let chatRoom;

    if (chatExists) {
      // Chat room exists, find it and add the message
      chatRoom = await ChatRoom.findOne({ buyer: sender, seller: receiver });
    } else {
      // Chat room doesn't exist, create a new one
      chatRoom = await createRoom(sender, receiver);
    }

    // Add the message to the chat room
    await ChatRoom.updateOne(
      { _id: chatRoom._id },
      { $push: { conversation: { senderId: sender, message } } }
    );

    res.status(200).json({ messageId: chatRoom._id });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createChatRoomAPI = createChatRoomAPI;
