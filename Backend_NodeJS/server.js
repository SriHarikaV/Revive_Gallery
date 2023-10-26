//server.js

const app = require("./index");
const { port } = require("./src/config/index.js");

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return process.exit(1);
  }
  console.log(`Server is running on ${port}`);
});
