const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const _ = require("lodash");

describe("Module 3", () => {
  it("you should have a folder named 'data' in the src directory @create-data-dir", () => {
    let indexFile = fs.existsSync(path.join(process.cwd(), "src/data"));
    expect(indexFile).to.not.equal(
      false,
      "It seems you have not created the `data` directory in `src/`."
    );
  });

  it("you should have a file named 'movies.json' in the src/data directory @create-movies-json", () => {
    let file = fs.existsSync(path.join(process.cwd(), "src/data/movies.json"));
    expect(file).to.not.equal(
      false,
      "It seems you have not created the `movies.json` directory in `src/data`."
    );
    if (file) {
      const movies = require("../src/data/movies.json");

      expect(movies.length).to.equal(
        3,
        `It looks like movies.json is missing some data. Please make sure it holds this content: ${JSON.stringify(
          [
            { title: "Die Hard" },
            { title: "Home Alone" },
            { title: "Love Actually" }
          ]
        )}`
      );
    }
  });

  it("index.js should import the movies json @import-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const variableDeclaration = res.body.filter(
      node => _.get(node, "declarations[0].id.name") === "movies"
    )[0];
    expect(
      _.get(variableDeclaration, "declarations[0].init.callee.name", "")
    ).to.equal(
      "require",
      "You should `require` movies.json at the top of index.js."
    );

    expect(
      _.get(variableDeclaration, "declarations[0].init.arguments[0].value", "")
    ).to.equal(
      "./data/movies.json",
      "You should require `./data/movies.json` at the top of index.js."
    );
  });

  it("fetchMovies() should declare a resolveFunction method @create-resolve-function", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const functionDeclaration = res.body.filter(
      node => _.get(node, "declaration.id.name") === "fetchMovies"
    )[0];
    const functionBody = functionDeclaration.declaration.body.body;
    const body = functionBody[0];
    expect(_.get(body, "kind", "")).to.equal(
      "const",
      "Variable `resolveFunction` should be defined as a `const`."
    );
    expect(_.get(body, "declarations[0].id.name", "")).to.equal(
      "resolveFunction",
      "Declare a variable named `resolveFunction` in the `fetchMovies()` method."
    );

    expect(_.get(body, "declarations[0].init.type", "")).to.equal(
      "ArrowFunctionExpression",
      "The `resolveFunction` method should be an arrow function."
    );
    expect(_.get(body, "declarations[0].init.body.name", "")).to.equal(
      "movies",
      "The `resolveFunction` method should return the `movies` object."
    );
  });

  it("index.js should import the fetchWithTimeout function @import-fetch-with-timeout", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    expect(_.get(res, "body[0].type", "")).to.equal(
      "ImportDeclaration",
      "You should use the `import` keyword to import `fetchWithTimeout`."
    );
    expect(_.get(res, "body[0].specifiers[0].imported.name", "")).to.equal(
      "fetchWithTimeout",
      "You should import the method named `fetchWithTimeout`."
    );
    expect(_.get(res, "body[0].source.value", "")).to.equal(
      "./services",
      "You should import `fetchWithTimeout` from `./services`."
    );
  });

  it("fetchMovies() should return the execution of `fetchWithTimeout` @return-fetch-with-timeout", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    expect(_.get(res, "body[2].declaration.body.body[1].type", "")).to.equal(
      "ReturnStatement"
    );
    expect(
      _.get(
        res,
        "body[2].declaration.body.body[1].argument.callee.object.callee.name",
        ""
      )
    ).to.equal(
      "fetchWithTimeout",
      "You should return a call to `fetchWithTimeout` in the `fetchMovies` method."
    );
    expect(
      _.get(
        res,
        "body[2].declaration.body.body[1].argument.callee.object.arguments[0].value",
        ""
      )
    ).to.equal(
      1000,
      "You should pass 1000 as the argument to `fetchWithTimeout`."
    );

    expect(
      _.get(
        res,
        "body[2].declaration.body.body[1].argument.arguments[0].name",
        ""
      )
    ).to.equal(
      "resolveFunction",
      "You should pass `resolveFunction` as the argument to the `then` property ( .then(resolveFunction) )."
    );
  });

  it("Variable `moviePromise` should be created and its value set to `fetchMovies` execution @execute-fetch-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });

    const moviePromise = _.get(res, "body[3]");

    expect(
      _.get(moviePromise, "declarations[0].init.callee.name", "")
    ).to.equal(
      "fetchMovies",
      "`moviePromise` should be initialized with a call of `fetchMovies()`."
    );
  });

  it("When resolving the `moviePromise` promise you should be able to console log the list of movies @log-movie-promise", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const body = _.get(res, "body[4]");
    expect(_.get(body, "expression.callee.property.name", "")).to.equal(
      "then",
      "You should use the `.then()` property to resolve the moviePromise."
    );
    expect(_.get(body, "expression.arguments[0].params[0].name", "")).to.equal(
      "results",
      "You should pass `results` as the only param to the resolve callback."
    );
    expect(
      _.get(
        body,
        "expression.arguments[0].body.body[0].expression.callee.object.name",
        ""
      )
    ).to.equal(
      "console",
      "You should be logging the results via the `console` object."
    );
    expect(
      _.get(
        body,
        "expression.arguments[0].body.body[0].expression.callee.property.name",
        ""
      )
    ).to.equal(
      "log",
      "You should be logging the results with the `log` method on the `console` object."
    );
    expect(
      _.get(
        body,
        "expression.arguments[0].body.body[0].expression.arguments[0].name",
        ""
      )
    ).to.equal(
      "results",
      "You should be passing the results to the `console.log` method."
    );
  });
});
