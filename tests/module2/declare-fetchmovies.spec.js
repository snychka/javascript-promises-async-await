const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const _ = require("lodash");

describe("Module 2", () => {
  let indexFile;
  beforeEach(() => {
    indexFile = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
  });
  it("should have an exported function named `fetchMovies` @declare-fetchmovies", () => {
    const res = acorn.parse(indexFile, { sourceType: "module" });

    const functionDeclaration = res.body.filter(
      node => _.get(node, "declaration.id.name") === "fetchMovies"
    )[0];
    expect(_.get(functionDeclaration, "declaration.id.name", "")).to.equal(
      "fetchMovies",
      "It seems that you have the wrong function name. It should be `fetchMovies`"
    );
  });
});
