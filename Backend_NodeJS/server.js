//server.js

const app = require("./index");
const socket = require("./socket.js");

const { port } = require("./src/config/index.js");

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
socket(io);

http.listen(port, () => {
  console.log(`Server is started at port : ${port}`);
});

module.exports = app;
