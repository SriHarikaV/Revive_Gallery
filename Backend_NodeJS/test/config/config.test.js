const { dbUri, prefix, port } = require("../../src/config");

describe("Genrate Random UID", () => {
  it("Prefix Should Match", () => {
    expect(prefix).toEqual("/api");
  });
  it("DB URI should Match", () => {
    expect(dbUri).toEqual(dbUri);
  });
  it("Port should Match", () => {
    expect(port).toEqual(8080);
  });
});
