const { User } = require("../../src/models/index.js");
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
    const user = await User.create({
      email: "test@example.com",
      password: "password",
      firstName: "firstName",
      lastName: "lastName",
    });

    expect(user).toEqual(
      expect.objectContaining({
        email: "test@example.com",
        password: "password",
        firstName: "firstName",
        lastName: "lastName",
      })
    );
  });
});
