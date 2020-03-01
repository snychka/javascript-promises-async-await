const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");

describe("Module 2", () => {
  let indexFile;
  beforeEach(() => {
    indexFile = fs.existsSync(path.join(process.cwd(), "src/index.js"));
  });
  it("you should have a file named 'index.js' in the src directory @entry", () => {
    expect(indexFile).to.not.equal(
      false,
      "It seems you have not created the `index.js` file in `src/`."
    );
  });
});
