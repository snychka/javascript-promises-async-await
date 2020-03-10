const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const walk = require("acorn-walk");
const _ = require("lodash");
const dirOpts = { depth: null };
describe("Module 8", () => {
  it("should return an error in `getBooksAndMoviesAsync()` @return-error-in-getbooksandmoviesasync", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const parent = {};
    const func = {};
    const catchWalk = {};
    walk.simple(res, {
      FunctionDeclaration(node) {
        if (_.get(node, "id.name", "") === "getBooksAndMoviesAsync") {
          func.node = node;
        }
      },
      VariableDeclaration(node) {
        if (
          _.get(node, "declarations[0].id.name", "") ===
          "getBooksAndMoviesAsync"
        ) {
          func.node = node;
        }
      }
    });
    const tryBlocks = [];
    walk.simple(func.node, {
      TryStatement(node) {
        tryBlocks.push(node);
      }
    });

    walk.simple(tryBlocks[0], {
      CatchClause(node) {
        catchWalk["CatchClause"] = node;
      },
      Literal(node) {
        catchWalk["Literal"] = node.value;
      },
      MemberExpression(node) {
        catchWalk["MemberExpression"] = node;
      },
      Identifier(node) {
        catchWalk["Identifier"] = node;
      }
    });
    let catchReturnNode = {};
    walk.simple(catchWalk.CatchClause, {
      ReturnStatement(node) {
        catchReturnNode = node;
      }
    });

    expect(_.get(catchReturnNode, "argument.name", "")).to.equal(
      "error",
      "You should return `error` in the catch block."
    );
  });

  it("@add-catch-to-execution", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const parent = {};
    const func = {};
    walk.findNodeAt(res, null, null, (nodeType, node) => {
      if (
        nodeType === "CallExpression" &&
        _.get(node, "callee.object.callee.object.callee.name", "") ===
          "getBooksAndMoviesAsync"
      ) {
        parent.node = node;
      }
    });

    walk.ancestor(parent.node, {
      ArrowFunctionExpression(node) {
        if (_.get(node, "params[0].name", "") === "error") {
          func.raceCatchNode = node;
        }
      }
    });
    expect(
      _.get(
        func.raceCatchNode,
        "body.body[0].expression.callee.object.name",
        ""
      )
    ).to.equal(
      "console",
      "You should be logging the results via the `console` object."
    );
    expect(
      _.get(
        func.raceCatchNode,
        "body.body[0].expression.callee.property.name",
        ""
      )
    ).to.equal(
      "error",
      "You should be logging the results with the `error` method on the `console` object."
    );

    expect(
      _.get(
        func.raceCatchNode,
        "body.body[0].expression.arguments[0].value",
        ""
      )
    ).to.equal(
      "Error in getBooksAndMoviesAsync execution",
      "You should be logging the message `Error in getBooksAndMoviesAsync execution`."
    );
    expect(
      _.get(func.raceCatchNode, "body.body[0].expression.arguments[1].name", "")
    ).to.equal(
      "error",
      "You should be logging the `error` object after the message."
    );
  });

  it("@return-a-rejected-promise", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const parent = {};
    const func = {};
    walk.simple(res, {
      FunctionDeclaration(node) {
        if (_.get(node, "id.name", "") === "getBooksOrMoviesAsync") {
          func.node = node;
        }
      },
      VariableDeclaration(node) {
        if (
          _.get(node, "declarations[0].id.name", "") === "getBooksOrMoviesAsync"
        ) {
          console.dir(node, dirOpts);
          func.node = node;
        }
      }
    });

    const tryBlocks = [];
    walk.simple(func.node, {
      TryStatement(node) {
        tryBlocks.push(node);
      },
      ArrayExpression(node) {
        if (_.get(node, "elements[0].callee.name", "") === "asyncFetchBookss") {
          console.dir(node, dirOpts);
          func.misspelledFunction = node;
        }
      }
    });

    expect(tryBlocks.length).to.equal(
      0,
      "You must remove the `try/catch` block from `getBooksOrMoviesAsync()`."
    );

    expect(func.misspelledFunction).to.not.be.undefined;
  });
});
