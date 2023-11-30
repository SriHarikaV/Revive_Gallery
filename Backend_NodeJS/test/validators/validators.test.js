const {
  validateProduct,
} = require("../../src/api/validators/product.validator");
const { validateRegister } = require("../../src/api/validators/user.validator");

describe("validateProduct Function", () => {
  test("Valid product data should pass validation", () => {
    const validProductData = {
      title: "Test Product",
      description: "This is a test product.",
      images: ["image1.jpg", "image2.jpg"],
      owner: "user123",
      price: 19.99,
      categories: ["electronics", "gadgets"],
    };

    const result = validateProduct(validProductData);
    expect(result).toStrictEqual({
      value: {
        ...validProductData,
      },
    });
  });

  test("Missing required field should fail validation", () => {
    const productDataWithoutTitle = {
      description: "This is a test product.",
      images: ["image1.jpg", "image2.jpg"],
      owner: "user123",
      price: 19.99,
      categories: ["electronics", "gadgets"],
    };

    const result = validateProduct(productDataWithoutTitle);

    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toContain('"title" is required');
  });

  test("Invalid data type should fail validation", () => {
    const productDataWithInvalidPrice = {
      title: "Test Product",
      description: "This is a test product.",
      images: ["image1.jpg", "image2.jpg"],
      owner: "user123",
      price: "invalid_price",
      categories: ["electronics", "gadgets"],
    };

    const result = validateProduct(productDataWithInvalidPrice);

    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toContain(
      '"price" must be a number'
    );
  });

  test("Empty string in array should fail validation", () => {
    const productDataWithEmptyStringInArray = {
      title: "Test Product",
      description: "This is a test product.",
      images: ["image1.jpg", ""],
      owner: "user123",
      price: 19.99,
      categories: ["electronics", "gadgets"],
    };

    const result = validateProduct(productDataWithEmptyStringInArray);

    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toContain(
      '"images[1]" is not allowed to be empty'
    );
  });

  test("Additional property should fail validation", () => {
    const productDataWithAdditionalProperty = {
      title: "Test Product",
      description: "This is a test product.",
      images: ["image1.jpg", "image2.jpg"],
      owner: "user123",
      price: 19.99,
      categories: ["electronics", "gadgets"],
      extraField: "additional field",
    };

    const result = validateProduct(productDataWithAdditionalProperty);

    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toContain(
      '"extraField" is not allowed'
    );
  });

  // Add more test cases as needed for different scenarios
});

describe("validateRegister Function", () => {
  test("Valid registration data should pass validation", () => {
    const validRegistrationData = {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    const result = validateRegister(validRegistrationData);

    expect(result.error).toBeUndefined();
  });

  test("Missing required field should fail validation", () => {
    const registrationDataWithoutEmail = {
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    const result = validateRegister(registrationDataWithoutEmail);
    expect(result.error).not.toBeNull();
    expect(result.error.details[0].message).toContain('"email" is required');
  });

  test("Invalid email format should fail validation", () => {
    const registrationDataWithInvalidEmail = {
      email: "invalid-email-format",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    const result = validateRegister(registrationDataWithInvalidEmail);

    expect(result.error).not.toBeNull();

    expect(result.error.details[0].message).toContain(
      '"email" must be a valid email'
    );
  });

  test("Short password should fail validation", () => {
    const registrationDataWithShortPassword = {
      email: "test@example.com",
      password: "pw",
      firstName: "John",
      lastName: "Doe",
    };

    const result = validateRegister(registrationDataWithShortPassword);

    expect(result.error).not.toBeNull();

    expect(result.error.details[0].message).toContain(
      '"password" length must be at least 3 characters long'
    );
  });

  test("Long firstName should fail validation", () => {
    const registrationDataWithLongFirstName = {
      email: "test@example.com",
      password: "password123",
      firstName: "VeryLongFirstNameThatExceedsMaxLength",
      lastName: "Doe",
    };

    const result = validateRegister(registrationDataWithLongFirstName);

    expect(result.error).not.toBeNull();

    expect(result.error.details[0].message).toContain(
      '"firstName" length must be less than or equal to 24 characters long'
    );
  });

  // Add more test cases as needed for different scenarios
});
