const { MongoClient } = require("mongodb");
const { dbUri } = require("../src/config/index.js");
const app = require("../index.js");
const request = require("supertest");
const { Product } = require("../src/models/index.js");

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

  it("should create a product with valid data", async () => {
    // Insert the mock user into the database before the test
    const mockProductData = {
      title: "Test Product of a user",
      description: "This is a sample product description 2.",
      images: ["image_url1", "image_url2"],
      owner: "653a2e25c666633625d0bc0e", // Should be a valid ObjectId referencing a user
      price: 10.99,
      categories: ["Three", "Four"],
    };

    const response = await request(app)
      .post("/api/product")
      .send(mockProductData);

    expect(response.status).toBe(200);
    expect(response.body.product).toBeDefined();
  });

  it("should return an error for invalid data", async () => {
    const invalidProductData = {
      description: "This is a sample product description 2.",
      images: ["image_url1", "image_url2"],
    };

    const response = await request(app)
      .post("/api/product")
      .send(invalidProductData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("should return an error if the user with the provided _id is not found", async () => {
    // Use a non-existing user _id
    const invalidProductData = {
      title: "Test Product of a user",
      description: "This is a sample product description 2.",
      images: ["image_url1", "image_url2"],
      owner: "653a2e66c696633625d0bc1a", // Should be a valid ObjectId referencing a user
      price: 10.99,
      categories: ["Three", "Four"],
    };
    const response = await request(app)
      .post("/api/product")
      .send(invalidProductData);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should handle errors gracefully", async () => {
    // Mocking the save method to throw an error
    const mockProductData = {
      title: "Test Product of a user",
      description: "This is a sample product description 2.",
      images: ["image_url1", "image_url2"],
      owner: "653a2e25c666633625d0bc0e", // Should be a valid ObjectId referencing a user
      price: 10.99,
      categories: ["Three", "Four"],
    };
    jest.spyOn(Product.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .post("/api/product")
      .send(mockProductData);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("should fetch products with valid query parameters", async () => {
    const response = await request(app).get("/api/product").query({
      owner: "653a2e25c666633625d0bc0e",
    });

    expect(response.status).toBe(200);
    expect(response.body.products).toBeDefined();
  });

  it("should handle errors gracefully", async () => {
    // Mocking the Product.find method to throw an error
    jest.spyOn(Product, "find").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app).get("/api/product");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("should update a product with a valid _id", async () => {
    const updatedData = {
      _id: "653a2e66c666633625d0bc1a",
      title: "Edited",
    };

    const response = await request(app)
      .put("/api/product")
      .send({ ...updatedData });

    expect(response.status).toBe(200);
    expect(response.body.product).toBeDefined();
  });

  it("should return an error if _id is not provided", async () => {
    const response = await request(app).put("/api/product").send({});

    expect(response.status).toBe(404);
  });

  it("should return an put error if the product with the provided _id is not found", async () => {
    const nonExistingId = "653a2e66c666633615d0vc1a";
    const response = await request(app)
      .put("/api/product")
      .send({ _id: nonExistingId });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("should handle put errors gracefully", async () => {
    // Mocking the findOneAndUpdate method to throw an error
    jest.spyOn(Product, "findOneAndUpdate").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .put("/api/product")
      .send({ _id: "653a2e66c666633615d0vc1a" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("should return an delete error if _id is not provided", async () => {
    const response = await request(app).delete("/api/product").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("_id is required for deletion");
  });

  it("should return an delete error if the product with the provided _id is not found", async () => {
    const nonExistingId = "653a2e66c666633615d0vc1a";
    const response = await request(app)
      .delete("/api/product")
      .send({ _id: nonExistingId });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("should handle delete errors gracefully", async () => {
    // Mocking the findOneAndDelete method to throw an error
    jest.spyOn(Product, "findOneAndDelete").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });
    const mockProduct = {
      _id: "653a2e66c666633615d0bc1a",
    };
    const response = await request(app)
      .delete("/api/product")
      .send({ _id: mockProduct._id });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });
});
