const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");

describe("Module 2", () => {
  let file;
  beforeEach(() => {
    file = fs.existsSync(path.join(process.cwd(), "src/services.js"));
  });
  it("you should have a file named 'services.js' in the src directory @services", () => {
    expect(file).to.not.equal(
      false,
      "It seems you have not created the `services.js` file in `src/`."
    );
  });
});
