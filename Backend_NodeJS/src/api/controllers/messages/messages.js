const { ChatRoom } = require("../../../models/index.js");

const getUserConversations = async (req, res) => {
  const { user } = req.body;

  try {
    let allChats = await ChatRoom.find()
      .populate("buyer", "email firstName lastName")
      .populate("seller", "email firstName lastName");
    let userChats = allChats.filter(
      (x) => x.buyer._id == user || x.seller._id == user
    );
    let checkedChats = userChats.map((x) => ({
      chats: x,
      isBuyer: x.buyer._id == user,
      myId: user,
    }));
    res.status(200).json(checkedChats);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getUserConversations = getUserConversations;
