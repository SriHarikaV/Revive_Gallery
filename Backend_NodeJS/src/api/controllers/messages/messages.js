const { ChatRoom } = require("../../../models/index.js");

class AsyncIterator {
  constructor(asyncOperations) {
    this.asyncOperations = asyncOperations;
    this.index = 0;
  }

  async next() {
    if (this.index < this.asyncOperations.length) {
      const result = await this.asyncOperations[this.index]();
      this.index++;
      return { value: result, done: false };
    } else {
      return { done: true };
    }
  }
}

const getConversations = async (req, res) => {
  const { user } = req.body;

  try {
    // Define asynchronous operations as an array of functions
    const asyncOperations = [
      async () => {
        const allChats = await ChatRoom.find()
          .populate("buyer", "email firstName lastName")
          .populate("seller", "email firstName lastName");
        return allChats;
      },
      async () => {
        const userChats = allChats.filter(
          (x) => x.buyer._id == user || x.seller._id == user
        );
        return userChats;
      },
      async () => {
        const checkedChats = userChats.map((x) => ({
          chats: x,
          isBuyer: x.buyer._id == user,
          myId: user,
        }));
        return checkedChats;
      },
    ];

    // Create an AsyncIterator
    const asyncIterator = new AsyncIterator(asyncOperations);

    // Iterate through the asynchronous operations
    let result = await asyncIterator.next();
    while (!result.done) {
      result = await asyncIterator.next();
    }

    // Final result is in result.value
    res.status(200).json(result.value);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getConversations = getConversations;
