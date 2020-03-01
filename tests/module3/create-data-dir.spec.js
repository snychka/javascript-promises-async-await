const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");

describe("Module 3", () => {
  let indexFile;
  beforeEach(() => {
    indexFile = fs.existsSync(path.join(process.cwd(), "src/data"));
  });
  it("you should have a folder named 'data' in the src directory @create-data-dir", () => {
    expect(indexFile).to.not.equal(
      false,
      "It seems you have not created the `data` directory in `src/`."
    );
  });
});
