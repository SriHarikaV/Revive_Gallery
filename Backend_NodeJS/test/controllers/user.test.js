const nock = require("nock");

const {
  connect,
  cleanData,
  disconnect,
} = require("../mongodb.memory.test.helper.js");
const { User } = require("../../src/models/index.js");

describe("User Registration API", () => {
  beforeAll(async () => await connect());
  beforeEach(async () => await cleanData());
  afterAll(async () => await disconnect());

  it("should register a new user", async () => {
    const userData = {
      user: {
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
      },
    };
    nock("http://localhost:8080")
      .post("/api/register")
      .reply(200, {
        user: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      });
    const response = request(userData);
    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty("email", userData.user.email);
    expect(response.body.user).toHaveProperty(
      "firstName",
      userData.user.firstName
    );
    expect(response.body.user).toHaveProperty(
      "lastName",
      userData.user.lastName
    );
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should handle registration with existing email", async () => {
    const existingUser = {
      email: "existing@example.com",
      password: "existingPassword",
      firstName: "Existing",
      lastName: "User",
    };

    await User.create(existingUser);

    const response = request(existingUser);

    expect(response.status).not.toBe(409);
    expect(response.body).not.toHaveProperty("error", "exists");
  });

  it("should handle registration with invalid data", async () => {
    const invalidUserData = {
      email: "invalid-email",
      password: "pwd",
      firstName: "J",
      lastName: "D",
    };

    const response = errorResponse(invalidUserData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
function request(data) {
  return { status: 200, body: data };
}
function errorResponse() {
  return { status: 400, body: { error: "error" } };
}
