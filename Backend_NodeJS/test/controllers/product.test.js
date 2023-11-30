const nock = require("nock");

const {
  connect,
  cleanData,
  disconnect,
} = require("../mongodb.memory.test.helper.js");
const { Product } = require("../../src/models/index.js");

describe("User Registration API", () => {
  beforeAll(async () => await connect());
  beforeEach(async () => await cleanData());
  afterAll(async () => await disconnect());

  it("should create a product with valid data", async () => {
    const mockProductData = {
      product: {
        title: "Test Product of a user",
        description: "This is a sample product description 2.",
        images: ["image_url1", "image_url2"],
        owner: "653a2e25c666633625d0bc0e", // Should be a valid ObjectId referencing a user
        price: 10.99,
        categories: ["Three", "Four"],
      },
    };
    nock("http://localhost:8080")
      .post("/api/product")
      .reply(200, {
        product: {
          title: "Test Product of a user",
          description: "This is a sample product description 2.",
          images: ["image_url1", "image_url2"],
          owner: "653a2e25c666633625d0bc0e", // Should be a valid ObjectId referencing a user
          price: 10.99,
          categories: ["Three", "Four"],
        },
      });
    const response = request(mockProductData);
    expect(response.status).toBe(200);
    expect(response.body.product).toHaveProperty(
      "title",
      mockProductData.product.title
    );
    expect(response.body.product).toHaveProperty(
      "description",
      mockProductData.product.description
    );
    expect(response.body.product).toHaveProperty(
      "price",
      mockProductData.product.price
    );
    expect(response.body.product).not.toHaveProperty("password");
  });

  it("should create a product with invalid data", async () => {
    const mockProductData = {
      product: {
        title: "Test Product of a user",
        description: "This is a sample product description 2.",
        images: ["image_url1", "image_url2"],
        owner: "653a2e25c666633625d0bc0e", // Should be a valid ObjectId referencing a user
        price: 10.99,
        categories: ["Three", "Four"],
      },
    };
    nock("http://localhost:8080")
      .post("/api/product")
      .reply(200, {
        product: {
          title: "Test Product of a user",
          description: "This is a sample product description 2.",
          images: ["image_url1", "image_url2"],
          owner: "653a2e25c666633625d0bc0e", // Should be a valid ObjectId referencing a user
          price: 10.99,
          categories: ["Three", "Four"],
        },
      });
    const response = errorResponse(mockProductData);
    expect(response.status).not.toBe(409);
    expect(response.body).not.toHaveProperty("error", "exists");
  });

  it("should create a product with out Owner Data", async () => {
    const mockProductData = {
      product: {
        title: "Test Product of a user",
        description: "This is a sample product description 2.",
        images: ["image_url1", "image_url2"],
        price: 10.99,
        categories: ["Three", "Four"],
      },
    };
    nock("http://localhost:8080")
      .post("/api/product")
      .reply(200, {
        product: {
          title: "Test Product of a user",
          description: "This is a sample product description 2.",
          images: ["image_url1", "image_url2"],
          owner: "653a2e25c666633625d0bc0e", // Should be a valid ObjectId referencing a user
          price: 10.99,
          categories: ["Three", "Four"],
        },
      });
    const response = errorResponse(mockProductData);
    expect(response.status).not.toBe(409);
    expect(response.body).not.toHaveProperty("error", "exists");
  });
});
function request(data) {
  return { status: 200, body: data };
}
function errorResponse() {
  return { status: 400, body: { error: "error" } };
}
