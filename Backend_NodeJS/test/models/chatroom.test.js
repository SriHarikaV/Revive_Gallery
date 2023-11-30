const ChatRoom = require("../../src/models/chatroom.js");
const {
  cleanData,
  connect,
  disconnect,
} = require("../mongodb.memory.test.helper.js");

describe("Name Target Model", () => {
  beforeAll(connect);
  beforeEach(cleanData);
  afterAll(disconnect);

  it("should create a name modal", async () => {
    const chatRoom = await ChatRoom.create({
      buyer: "653a2e25c666633625d0bc0e",
      seller: "653a2e25c666633625d0bc0e",
    });

    expect(chatRoom).toEqual(
      expect.objectContaining({
        buyer: expect.anything(),
        seller: expect.anything(),
        conversation: [],
        __v: 0,
      })
    );
  });
});
