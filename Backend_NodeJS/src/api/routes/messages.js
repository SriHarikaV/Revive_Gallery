const { Router } = require("express");

const {
  createChatRoomApi,
  getUserConversationsApi,
  sendMessageApi,
} = require("../controllers/messages/index.js");

const router = Router();
router.get("/", (req, res) => {
  res.send({ data: "data" });
});

router.post("/createChatRoom", createChatRoomApi);
router.post("/getUserConversations", getUserConversationsApi);
router.post("/sendMessage", sendMessageApi);

module.exports = router;
