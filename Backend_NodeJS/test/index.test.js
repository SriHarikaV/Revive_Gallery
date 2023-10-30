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

  it("should authenticate a user with valid credentials", async () => {
    const existingUser = {
      email: "test@example.com",
      password: "password123", // Provide data for an existing user with valid credentials
    };

    // Assuming you have a route for registering users

    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: existingUser.email,
        password: existingUser.password,
      })
      .expect(200);

    // Add more assertions as needed
    expect(response.body.user).toBeDefined();
    // Add more assertions as needed
  });

  it("should handle invalid credentials (email)", async () => {
    const invalidUser = {
      // Provide data for a user with invalid email
      email: "test@example.coms",
      password: "wrongpass",
    };

    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: invalidUser.email,
        password: invalidUser.password,
      })
      .expect(401);

    // Add more assertions as needed
    expect(response.body.error).toBeDefined();
    // Add more assertions as needed
  });

  it("should handle invalid credentials (password)", async () => {
    const existingUser = {
      email: "test@example.com",
    };

    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: existingUser.email,
        password: "invalidPassword",
      })
      .expect(401);

    // Add more assertions as needed
    expect(response.body.error).toBeDefined();
    // Add more assertions as needed
  });

  it("should handle internal server error", async () => {
    // Simulate an internal server error
    jest
      .spyOn(require("mongoose").Model, "findOne")
      .mockImplementationOnce(() => {
        throw new Error("Simulated Internal Server Error");
      });

    const existingUser = {
      // Provide data for an existing user with valid credentials
      email: "test@example.com",
      password: "password123",
    };

    const { error } = await request(app)
      .post("/api/user/login")
      .send({
        email: existingUser.email,
        password: existingUser.password,
      })
      .expect(500);

    // Add more assertions as needed
    expect(error).toBeDefined();
    // Add more assertions as needed
  });

  it("should delete an existing user", async () => {
    const { status } = await request(app)
      .delete("/api/user/delete")
      .send({ email: "test@example.com" })
      .expect(200);

    // Add more assertions as needed
    expect(status).toBeTruthy();
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