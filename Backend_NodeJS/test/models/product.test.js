const { Product } = require("../../src/models/index.js");
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
    const product = await Product.create({
      title: "Test Product of a product",
      description: "This is a sample product description 2.",
      images: ["image_url1", "image_url2"],
      owner: "653a2e25c666633625d0bc0e", // Should be a valid ObjectId referencing a product
      price: 10.99,
      categories: ["Three", "Four"],
    });

    expect(product).toEqual(
      expect.objectContaining({
        title: "Test Product of a product",
        description: "This is a sample product description 2.",
        images: ["image_url1", "image_url2"],
        owner: expect.anything(), // Should be a valid ObjectId referencing a product
        price: 10.99,
        categories: ["Three", "Four"],
      })
    );
  });
});
