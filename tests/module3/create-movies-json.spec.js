const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
describe("Module 3", () => {
  let file;
  beforeEach(() => {
    file = fs.existsSync(path.join(process.cwd(), "src/data/movies.json"));
  });
  it("you should have a file named 'movies.json' in the src/data directory @create-movies-json", () => {
    const res = require("../../src/data/movies.json");
    expect(file).to.not.equal(
      false,
      "It seems you have not created the `movies.json` directory in `src/data`."
    );

    expect(res.length).to.equal(
      3,
      `It looks like movies.json is missing some data. Please make sure it holds this content: ${JSON.stringify(
        [
          { title: "Die Hard" },
          { title: "Home Alone" },
          { title: "Love Actually" }
        ]
      )}`
    );
  });
});
