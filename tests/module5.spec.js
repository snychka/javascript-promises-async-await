const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const walk = require("acorn-walk");
const _ = require("lodash");

function getFunctionNames(codeString) {
  var names = [];
  walk.simple(codeString, {
    AssignmentExpression: function(node) {
      if (
        node.left.type === "Identifier" &&
        (node.right.type === "FunctionExpression" ||
          node.right.type === "ArrowFunctionExpression")
      ) {
        names.push(node.left.name);
      }
    },
    ExportNamedDeclaration: function(node) {
      // console.dir(node);
    },
    VariableDeclaration: function(node) {
      node.declarations.forEach(function(declaration) {
        if (
          declaration.init &&
          (declaration.init.type === "FunctionExpression" ||
            declaration.init.type === "ArrowFunctionExpression")
        ) {
          names.push(declaration.id.name);
        }
      });
    },
    Function: function(node) {
      if (node.id) {
        names.push(node.id.name);
      }
    }
  });
  return names;
}

describe("Module 5", () => {
  it("@create-async-fetch-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/services.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const names = getFunctionNames(res);

    const allExportedFunctions = [];
    expect(names.includes("asyncFetchMovies")).to.equal(
      true,
      "You should define a function named `asyncFetchMovies` in services.js"
    );

    walk.simple(res, {
      ExportNamedDeclaration(node) {
        allExportedFunctions.push(node);
      }
    });
    const asyncFunc = _.find(allExportedFunctions, val => {
      return _.get(val, "declaration.id.name", "") === "asyncFetchMovies";
    });
    expect(asyncFunc).to.not.equal(false);
    expect(_.get(asyncFunc, "declaration.async", false)).to.equal(
      true,
      "Make sure to put the `async` keyword before the `function` keyword"
    );
  });

  it("@add-try-catch-to-async-fetch-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/services.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const allExportedFunctions = [];
    walk.simple(res, {
      ExportNamedDeclaration(node) {
        allExportedFunctions.push(node);
      }
    });
    const asyncFunc = _.find(allExportedFunctions, val => {
      return _.get(val, "declaration.id.name", "") === "asyncFetchMovies";
    });
    const body = _.get(asyncFunc, "declaration.body.body[0]", {});
    expect(body.type).to.equal(
      "TryStatement",
      "Add a `try/catch` block to the body of `asyncFetchMovies()`"
    );
    expect(_.get(body, "handler.param.name", "")).to.equal(
      "error",
      "Remember to pass `error` as the only parameter to the `catch` clause"
    );
  });

  it("@await-fetch-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/services.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const allExportedFunctions = [];
    walk.simple(res, {
      ExportNamedDeclaration(node) {
        allExportedFunctions.push(node);
      }
    });
    const asyncFunc = _.find(allExportedFunctions, val => {
      return _.get(val, "declaration.id.name", "") === "asyncFetchMovies";
    });
    const tryBlock = _.get(asyncFunc, "declaration.body.body[0]", {});
    const catchBlock = _.get(asyncFunc, "declaration.body.body[0].handler", {});
    const allVars = [];
    walk.simple(tryBlock, {
      VariableDeclarator(node) {
        allVars.push(node.id.name);
      }
    });
    expect(_.isEqual(allVars, ["response", "results"])).to.equal(
      true,
      "You may be missing the `response` variable or the `results` variable."
    );
    const catchExp = [];
    walk.simple(catchBlock, {
      CallExpression(node) {
        catchExp.push(node);
      }
    });
    expect(_.get(catchExp[0], "callee.object.name", "")).to.equal(
      "console",
      "Make sure to use the `console` object for logging"
    );
    expect(_.get(catchExp[0], "callee.property.name", "")).to.equal(
      "log",
      "Make sure to use the `log()` method on the `console` object"
    );
    expect(_.get(catchExp[0], "arguments[0].name", "")).to.equal(
      "error",
      "You should pass `error` as the argument to `console.log()`"
    );
  });
});
