const userModel = require("./user.js");
const productModel = require("./product.js");
const chatRoomModel = require("./chatroom.js");

module.exports = {
  User: userModel,
  Product: productModel,
  ChatRoom: chatRoomModel,
};
