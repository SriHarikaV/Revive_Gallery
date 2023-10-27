const { MongoClient } = require("mongodb");
const { dbUri } = require("../src/config/index.js");
const app = require("../index.js");
const request = require("supertest");

describe("insert", () => {
  let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db("test");
  });

  afterAll(async () => {
    await connection.close();
  });

  test("should return a success message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: "Project is successfully working...",
    });
  });
  it("should register a new user", async () => {
    const newUser = {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    const response = await request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(200);

    // Add more assertions as needed
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(newUser.email);
    // Add more assertions as needed
  });

  it("should handle validation errors", async () => {
    const invalidUser = {};

    const response = await request(app)
      .post("/api/user/register")
      .send(invalidUser)
      .expect(400);

    // Add more assertions as needed
    expect(response.body.error).toBeDefined();
    // Add more assertions as needed
  });

  it("should handle existing user conflict", async () => {
    const existingUser = {
      email: "test@test.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    const response = await request(app)
      .post("/api/user/register")
      .send(existingUser)
      .expect(409);

    // Add more assertions as needed
    expect(response.body.error).toBeDefined();
    // Add more assertions as needed
  });
});
