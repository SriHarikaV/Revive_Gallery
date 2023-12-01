const { generateRandomUid } = require("../../src/utils");

describe("Genrate Random UID", () => {
  it("should be ok", () => {
    expect(generateRandomUid()).toBeTruthy();
  });
});
