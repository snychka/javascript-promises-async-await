const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const _ = require("lodash");

describe("Module 2", () => {
  let serviceFile;
  beforeEach(() => {
    serviceFile = fs.readFileSync(
      path.join(process.cwd(), "src/services.js"),
      "utf8"
    );
  });
  it("services.js should have an exported function named `fetchWithTimeout` @settimeout-promise", () => {
    const res = acorn.parse(serviceFile, { sourceType: "module" });

    const functionDeclaration = res.body.filter(
      node => _.get(node, "declaration.id.name") === "fetchWithTimeout"
    )[0];
    const functionParams = functionDeclaration.declaration.params;
    const params = functionParams[0];

    expect(_.get(functionDeclaration, "declaration.id.name", "")).to.equal(
      "fetchWithTimeout",
      "It seems that you have the wrong function name. It should be `fetchWithTimeout`"
    );

    expect(_.get(params, "name", "")).to.equal(
      "delay",
      "It looks like you are missing the `delay` parameter."
    );
  });
});
