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
  it("fetchWithTimeout should return a Promise that uses `setTimeout` @http-delay", () => {
    const res = acorn.parse(serviceFile, { sourceType: "module" });
    const functionDeclaration = res.body.filter(
      node => _.get(node, "declaration.id.name") === "fetchWithTimeout"
    )[0];
    const functionBody = functionDeclaration.declaration.body.body;
    const body = functionBody[0];

    expect(_.get(functionDeclaration, "declaration.id.name", "")).to.equal(
      "fetchWithTimeout",
      "It seems that you have the wrong function name. It should be `fetchWithTimeout`"
    );

    expect(_.get(body, "type", "")).to.equal(
      "ReturnStatement",
      "You need to have a return in the `fetchWithTimeout` function"
    );

    expect(_.get(body, "argument.type", "")).to.equal(
      "NewExpression",
      "It looks like you are missing the `new` keyword when declaring the Promise"
    );
    expect(_.get(body, "argument.callee.name", "")).to.equal(
      "Promise",
      "fetchWithTimeout needs to return a `new Promise`"
    );
    expect(_.get(body, "argument.arguments[0].params[0].name", "")).to.equal(
      "resolve",
      "It looks like you are missing the `resolve` parameter of your Promise callback."
    );

    expect(_.get(body, "argument.arguments[0].body.callee.name", "")).to.equal(
      "setTimeout",
      "The Promise callback should invoke `setTimeout`."
    );

    expect(
      _.get(body, "argument.arguments[0].body.arguments[0].name", "")
    ).to.equal(
      "resolve",
      "`setTimeout` should have the variable `resolve` as the first param."
    );

    expect(
      _.get(body, "argument.arguments[0].body.arguments[1].name", "")
    ).to.equal(
      "delay",
      "`setTimeout` should have the variable `delay` as the second param."
    );
  });
});
