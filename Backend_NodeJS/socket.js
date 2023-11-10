const {
  sendMessageSocket,
} = require("./src/api/controllers/messages/sendMessage");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("sendMessage", async ({ chatId, user, message }, callback) => {
      try {
        const status = await sendMessageSocket({
          sender: user._id,
          chatId,
          message,
        });
        console.log(status);
        if (status)
          socket.to(chatId).emit("receiveMessage", { chatId, user, message });
      } catch (error) {
        //console.log(error);
        if (error) return callback(error);
      }
      callback();
    });

    socket.on("JOIN_ROOM", async ({ chatId }, callback) => {
      try {
        console.log("joined the chatroom", chatId);
      } catch (error) {
        if (error) return callback(error);
      }
      socket.join(chatId);
      callback();
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
  });
};
