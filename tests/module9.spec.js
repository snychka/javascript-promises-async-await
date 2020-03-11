const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const walk = require("acorn-walk");
const _ = require("lodash");
const dirOpts = { depth: null };

describe("Module 9", () => {
  it("should define a const `timer1` and assign it a `setTimeout()` execution @create-timer1", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const parent = {};
    const func = {};
    walk.findNodeAt(res, null, null, (nodeType, node) => {
      if (
        nodeType === "VariableDeclaration" &&
        _.get(node, "declarations[0].id.name", "") === "timer1"
      ) {
        parent.node = node;
      }
    });

    walk.ancestor(parent.node, {
      ArrowFunctionExpression(node, anc) {
        anc.forEach(val => {
          if (
            val.type === "CallExpression" &&
            val.callee.name === "setTimeout"
          ) {
            func.setTimeoutCallback = node;
          }
        });
      }
    });
    expect(
      parent.node,
      "You must declare a variable `const timer1` at the bottom of index.js"
    ).to.not.be.undefined;

    expect(
      func.setTimeoutCallback,
      "The value of `timer` should be a call to `setTimeout()`."
    ).to.be.ok;

    expect(
      _.get(
        func.setTimeoutCallback,
        "body.body[0].expression.callee.object.name",
        " "
      )
    ).to.equal(
      "console",
      "You should be logging the results via the `console` object."
    );
    expect(
      _.get(
        func.setTimeoutCallback,
        "body.body[0].expression.callee.property.name",
        ""
      )
    ).to.equal(
      "log",
      "You should be logging the results with the `log` method on the `console` object."
    );
    expect(
      _.get(
        func.setTimeoutCallback,
        "body.body[0].expression.arguments[0].value",
        ""
      )
    ).to.equal(
      "timer 1 has finished",
      "The logged message should be `timer 1 has finished`"
    );
    expect(
      _.get(parent.node, "declarations[0].init.arguments[1].value", "")
    ).to.equal(20000, "The `setTimeout` in `timer1` should run for 20000 ms.");
  });

  it("should use `clearTimeout()` to stop `timer1` early @use-clearTimeout", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const parent = {};
    const func = {};
    walk.findNodeAt(res, null, null, (nodeType, node) => {
      if (
        nodeType === "VariableDeclaration" &&
        _.get(node, "declarations[0].id.name", "") === "timer2"
      ) {
        parent.node = node;
      }
    });

    walk.ancestor(parent.node, {
      ArrowFunctionExpression(node, anc) {
        anc.forEach(val => {
          if (
            val.type === "CallExpression" &&
            val.callee.name === "setTimeout"
          ) {
            func.setTimeoutCallback = node;
          }
        });
      }
    });

    walk.simple(func.setTimeoutCallback, {
      ExpressionStatement(node) {
        if (_.get(node, "expression.callee.name", "") === "clearTimeout") {
          func.clearTimeout = node;
        }
      }
    });

    expect(
      parent.node,
      "You must declare a variable `const timer2` at the bottom of index.js"
    ).to.not.be.undefined;

    expect(
      func.setTimeoutCallback,
      "The value of `timer` should be a call to `setTimeout()`."
    ).to.be.ok;
    expect(
      func.clearTimeout,
      "You should be calling `clearTimeout()` in the `setTimeout()` callback of `timer2`."
    ).to.be.ok;

    expect(
      _.get(func.clearTimeout, "expression.arguments[0].name", "")
    ).to.equal(
      "timer1",
      "You must pass the variable `timer1` to `clearTimeout()` as an argument."
    );

    expect(
      _.get(parent.node, "declarations[0].init.arguments[1].value", "")
    ).to.equal(2000, "The `setTimeout` in `timer2` should run for 2000 ms.");
  });
});
