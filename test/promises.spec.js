const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const _ = require("lodash");

describe("promises.js", () => {
  context("Function is a promise", () => {
    let file;
    beforeEach(() => {
      file = fs.readFileSync(
        path.join(process.cwd(), "src/promises.js"),
        "utf8"
      );
    });

    it("should have an exported fetchMovies function", () => {
      const res = acorn.parse(file, { sourceType: "module" });
      expect(res.body.filter(node => !!node.declaration).length).to.equal(
        1,
        "It seems you are not exporting a function from `promises.js`."
      );

      const functionDeclaration = res.body.filter(
        node => _.get(node, "declaration.id.name") === "fetchMovies"
      )[0];
      expect(_.get(functionDeclaration, "declaration.id.name", "")).to.equal(
        "fetchMovies",
        "It seems that you have the wrong function name. It should be `fetchMovies`"
      );
    });

    it("should declare a Promise with `resolve` and `reject` as params", () => {
      const res = acorn.parse(file, { sourceType: "module" });
      const functionDeclaration = res.body.filter(
        node => _.get(node, "declaration.id.name") === "fetchMovies"
      )[0];
      const functionBody = functionDeclaration.declaration.body.body;
      const body = functionBody[0];
      expect(_.get(body, "argument.callee.name", "")).to.equal(
        "Promise",
        "It looks like you aren't returning a `Promise` in `fetchMovies`"
      );

      expect(_.get(body, "argument.arguments[0].params[0].name", "")).to.equal(
        "resolve",
        "It looks like you are missing the `resolve` parameter."
      );
      expect(_.get(body, "argument.arguments[0].params[1].name", "")).to.equal(
        "reject",
        "It looks like you are missing the `reject` parameter."
      );
    });

    it("should have a setTimeout that lasts 1000 ms", () => {
      const res = acorn.parse(file, { sourceType: "module" });
      const functionDeclaration = res.body.filter(
        node => _.get(node, "declaration.id.name") === "fetchMovies"
      )[0];
      const functionBody = functionDeclaration.declaration.body.body;
      const body = functionBody[0];
      expect(
        _.get(
          body,
          "argument.arguments[0].body.body[0].expression.callee.name",
          ""
        )
      ).to.eql(
        "setTimeout",
        "It looks like you are missing a `setTimeout` declaration."
      );
      expect(
        _.get(
          body,
          "argument.arguments[0].body.body[0].expression.arguments[1].value",
          ""
        )
      ).to.eql(1000, "You should set the `setTimeout` wait time to 1000 ms.");
    });

    it("should resolve the promise with an array within the setTimeout", () => {
      const res = acorn.parse(file, { sourceType: "module" });
      const functionDeclaration = res.body.filter(
        node => _.get(node, "declaration.id.name") === "fetchMovies"
      )[0];
      const functionBody = functionDeclaration.declaration.body.body;
      const body = functionBody[0];
      expect(
        _.get(
          body,
          "argument.arguments[0].body.body[0].expression.arguments[0].body.body[0].expression.callee.name",
          ""
        )
      ).to.eql(
        "resolve",
        "You should call `resolve` within the setTimeout callback."
      );
      const movieArray = _.get(
        body,
        "argument.arguments[0].body.body[0].expression.arguments[0].body.body[0].expression.arguments[0].elements",
        []
      );
      expect(movieArray.length).to.eql(
        3,
        "You should pass an array of movie titles into the resolve."
      );
      expect(
        movieArray.every(obj => obj.properties[0].key.name === "title")
      ).to.eql(
        true,
        "It looks like the `title` property is missing on one or more of the movie objects in your resolve."
      );
    });

    it("should call fetchMovies and set the result to a variable called `moviePromise`", () => {
      const res = acorn.parse(file, { sourceType: "module" });
      const moviePromiseNode = res.body[1];
      expect(_.get(moviePromiseNode, "declarations[0].id.name", "")).to.eql(
        "moviePromise",
        "You are missing a variable named `moviePromise`."
      );
      expect(
        _.get(moviePromiseNode, "declarations[0].init.callee.name", "")
      ).to.eql(
        "fetchMovies",
        "The moviePromise variable should have a value of `fetchMovies()`."
      );
    });

    it("should be able to call .then on moviePromise to get the results", () => {
      const res = acorn.parse(file, { sourceType: "module" });
      const expression = res.body[2];
      expect(_.get(expression, "expression.callee.property.name", "")).to.eql(
        "then",
        "You may have forgotten to call `.then` on the `moviePromise` object."
      );
    });
    it("should pass results as the only param to `.then`, then call `console.log`.", () => {
      const res = acorn.parse(file, { sourceType: "module" });
      const expression = res.body[2];
      expect(
        _.get(expression, "expression.arguments[0].params[0].name", "")
      ).to.eql(
        "results",
        "Don't forget to pass the `results` param to the `.then` callback."
      );
      expect(
        _.get(
          expression,
          "expression.arguments[0].body.body[0].expression.callee.object.name",
          ""
        )
      ).to.eql(
        "console",
        "You seem to be missing the `console.log` statement."
      );
      expect(
        _.get(
          expression,
          "expression.arguments[0].body.body[0].expression.callee.property.name",
          ""
        )
      ).to.eql(
        "log",
        "You should be using the `log` property on the `console` object, like `console.log(..)`."
      );
      expect(
        _.get(
          expression,
          "expression.arguments[0].body.body[0].expression.arguments[0].name",
          ""
        )
      ).to.eql(
        "results",
        "It looks like you need to pass `results` to the console.log command."
      );
    });
  });
});
