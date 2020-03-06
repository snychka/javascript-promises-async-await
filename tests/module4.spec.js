const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const walk = require("acorn-walk");
const _ = require("lodash");

describe("Module 4", () => {
  it("should no longer have a fetchMovies or moviePromise declaration in index.js @remove-old-fetch-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const fetchMoviesfunctionDeclaration = res.body.filter(
      node => _.get(node, "declaration.id.name") === "fetchMovies"
    )[0];
    const fetchMoviesvariableDeclaration = res.body.filter(
      node =>
        _.get(node, "declaration.type", "") === "VariableDeclaration" &&
        _.get(node, "declaration.declarations[0].id.name", "") === "fetchMovies"
    )[0];
    const moviePromisevariableDeclaration = res.body.filter(
      node =>
        _.get(node, "type", "") === "VariableDeclaration" &&
        _.get(node, "declarations[0].id.name", "") === "moviePromise"
    )[0];
    const moviePromiseExpression = res.body.filter(
      node =>
        _.get(node, "type", "") === "ExpressionStatement" &&
        _.get(node, "expression.callee.object.name", "") === "moviePromise"
    )[0];
    expect(
      _.get(fetchMoviesfunctionDeclaration, "declaration.id.name", "")
    ).to.equal(
      "",
      "You should remove both `fetchMovies` and `moviePromise` from index.js"
    );
    expect(
      _.get(
        fetchMoviesvariableDeclaration,
        "declaration.declarations[0].id.name",
        ""
      )
    ).to.equal(
      "",
      "You should remove both `fetchMovies` and `moviePromise` from index.js"
    );
    expect(
      _.get(moviePromisevariableDeclaration, "declarations[0].id.name", "")
    ).to.equal(
      "",
      "You should remove both `fetchMovies()` and `const moviePromise` from index.js"
    );
    expect(
      _.get(moviePromiseExpression, "expression.callee.object.name", "")
    ).to.equal(
      "",
      "You should remove the `moviePromise.then` call from index.js"
    );
  });

  it("should export a `fetchMovies()` function from services.js @move-fetch-movies-to-services", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/services.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    let fetchMoviesDeclaration;

    walk.ancestor(res, {
      FunctionDeclaration(node) {
        const name = node.id.name;
        if (name === "fetchMovies") {
          fetchMoviesDeclaration = name;
        }
      },
      VariableDeclarator(node) {
        const name = node.id.name;
        if (name === "fetchMovies") {
          fetchMoviesDeclaration = name;
        }
      }
    });

    expect(fetchMoviesDeclaration === "fetchMovies").to.equal(true);
  });

  it("should use the Fetch API inside of the body of `fetchMovies()` @use-fetch-api-to-get-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/services.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });

    const fetchMoviesNode = res.body.filter(
      node =>
        (node.type === "ExportNamedDeclaration" &&
          _.get(node, "declaration.type", "") === "FunctionDeclaration" &&
          _.get(node, "declaration.id.name", "") === "fetchMovies") ||
        (node.type === "ExportNamedDeclaration" &&
          _.get(node, "declaration.type", "") === "VariableDeclaration" &&
          _.get(node, "declaration.declarations[0].id.name") === "fetchMovies")
    )[0];
    const body = _.has(fetchMoviesNode, "declaration.declarations")
      ? _.get(fetchMoviesNode, "declaration.declarations[0].init.body.body[0]")
      : _.get(fetchMoviesNode, "declaration.body.body[0]");

    expect(body.type === "ReturnStatement").to.equal(
      true,
      "You should use `return` the fetch call inside of `fetchMovies()`"
    );

    const fetchApiCall = _.get(
      body,
      "argument.callee.object.callee.object.callee.object.callee.name",
      ""
    );
    const fetchApiArgs = _.get(
      body,
      "argument.callee.object.callee.object.callee.object.arguments[0].value",
      ""
    );

    const responseParam = _.get(
      body,
      "argument.callee.object.callee.object.arguments[0].params[0].name",
      ""
    );

    const responseBody = _.get(
      body,
      "argument.callee.object.callee.object.arguments[0].body",
      ""
    );
    expect(responseParam).to.equal("response");
    expect(_.get(responseBody, "callee.object.name", "")).to.equal(
      "response",
      "You should be calling `response.json()` in the first `.then()` method"
    );
    expect(_.get(responseBody, "callee.property.name", "")).to.equal(
      "json",
      "You should be calling `response.json()` in the first `.then()` method"
    );
    expect(fetchApiCall === "fetch").to.equal(
      true,
      "You should use the `fetch()` API"
    );
    expect(fetchApiArgs === "./data/movies.json").to.equal(
      true,
      "You should pass `./data/movies.json` as an argument to the `fetch()` call"
    );

    const moviesParam = _.get(
      body,
      "argument.callee.object.arguments[0].params[0].name",
      ""
    );
    const moviesBody = _.get(
      body,
      "argument.callee.object.arguments[0].body.name",
      ""
    );
    expect(moviesParam).to.equal(
      "movies",
      "You should pass `movies` as the parameter to the second `.then()` call"
    );

    expect(moviesBody).to.equal(
      "movies",
      "You should only pass `movies` in body of the second `.then()` callback"
    );
  });

  it("should have a `books.json` file available in the `data/` directory @create-books-json", () => {
    let file = fs.existsSync(path.join(process.cwd(), "src/data/books.json"));
    expect(file).to.not.equal(
      false,
      "Make sure you create the file `books.json` in the `data/` directory"
    );
    if (file) {
      const books = require("../src/data/books.json");
      expect(
        _.isEqual(books, [
          {
            title: "The Eye of the World",
            author: "Robert Jordan"
          },
          {
            title: "Extinction Machine",
            author: "Jonathan Maberry"
          },
          {
            author: "Andrew Rowe",
            title: "Sufficiently Advanced Magic"
          }
        ])
      ).to.equal(
        true,
        "Make sure the books.json file has an array with the three objects from the instructions."
      );
    }
  });

  it("@create-fetch-books-function", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/services.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const fetchBooksNode = res.body.filter(
      node =>
        (_.get(node, "type", "") === "ExportNamedDeclaration" &&
          _.get(node, "declaration.type", "") === "FunctionDeclaration" &&
          _.get(node, "declaration.id.name", "") === "fetchBooks") ||
        (_.get(node, "type", "") === "ExportNamedDeclaration" &&
          _.get(node, "declaration.type", "") === "VariableDeclaration" &&
          _.get(node, "declaration.declarations[0].id.name") === "fetchBooks")
    )[0];
    const body = _.has(fetchBooksNode, "declaration.declarations")
      ? _.get(fetchBooksNode, "declaration.declarations[0].init.body.body[0]")
      : _.get(fetchBooksNode, "declaration.body.body[0]");

    expect(_.get(body, "type", "") === "ReturnStatement").to.equal(
      true,
      "You should use `return` the fetch call inside of `fetchBooks()`"
    );

    const fetchApiCall = _.get(
      body,
      "argument.callee.object.callee.object.callee.object.callee.name",
      ""
    );
    const fetchApiArgs = _.get(
      body,
      "argument.callee.object.callee.object.callee.object.arguments[0].value",
      ""
    );

    const responseParam = _.get(
      body,
      "argument.callee.object.callee.object.arguments[0].params[0].name",
      ""
    );

    const responseBody = _.get(
      body,
      "argument.callee.object.callee.object.arguments[0].body",
      ""
    );

    expect(responseParam).to.equal("response");
    expect(_.get(responseBody, "callee.object.name", "")).to.equal(
      "response",
      "You should be calling `response.json()` in the first `.then()` method"
    );
    expect(_.get(responseBody, "callee.property.name", "")).to.equal(
      "json",
      "You should be calling `response.json()` in the first `.then()` method"
    );
    expect(fetchApiCall === "fetch").to.equal(
      true,
      "You should use the `fetch()` API"
    );
    expect(fetchApiArgs === "./data/books.json").to.equal(
      true,
      "You should pass `./data/books.json` as an argument to the `fetch()` call"
    );
    const booksParam = _.get(
      body,
      "argument.callee.object.arguments[0].params[0].name",
      ""
    );
    const booksBody = _.get(
      body,
      "argument.callee.object.arguments[0].body.name",
      ""
    );
    expect(booksParam).to.equal(
      "books",
      "You should pass `books` as the parameter to the second `.then()` call"
    );

    expect(booksBody).to.equal(
      "books",
      "You should only pass `books` in body of the second `.then()` callback"
    );
  });

  it("should have new imports in index.js @import-new-fetch-calls-to-index", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const imports = _.get(res, "body[0].specifiers");
    const fetchMoviesImport = _.find(
      imports,
      val => _.get(val, "imported.name", "") === "fetchMovies"
    );
    const fetchBooksImport = _.find(
      imports,
      val => _.get(val, "imported.name", "") === "fetchBooks"
    );

    expect(_.get(res, "body[0].type", "")).to.equal(
      "ImportDeclaration",
      "You should use the `import` keyword to import named functions."
    );
    expect(_.get(fetchMoviesImport, "imported.name", "")).to.equal(
      "fetchMovies",
      "You should import the method named `fetchMovies`."
    );
    expect(_.get(fetchBooksImport, "imported.name", "")).to.equal(
      "fetchBooks",
      "You should import the method named `fetchBooks`."
    );
    expect(_.get(res, "body[0].source.value", "")).to.equal(
      "./services",
      "You should import `fetchWithTimeout` from `./services`."
    );
  });
  it("should use Promise.all to resolve both promises @get-books-and-movies-with-promise-all", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const funcDec = res.body.filter(
      node =>
        _.get(node, "type", "") === "FunctionDeclaration" &&
        _.get(node, "id.name", "") === "getBooksAndMovies"
    )[0];

    const varDec = res.body.filter(
      node =>
        _.get(node, "type", "") === "VariableDeclaration" &&
        _.get(node, "declarations[0].id.name") === "getBooksAndMovies"
    )[0];
    if (varDec) {
      const promiseResultParams = _.get(
        varDec,
        "declarations[0].init.body.body[0].argument.callee.object.arguments[0].params[0]",
        ""
      );
      const body = _.get(varDec, "declarations[0].init.body.body[0]", "");
      expect(_.get(promiseResultParams, "elements[0].name", "")).to.equal(
        "books",
        "You should pass `books` as the first array item in the parameter."
      );
      expect(_.get(promiseResultParams, "elements[1].name", "")).to.equal(
        "movies",
        "You should pass `movies` as the second array item in the parameter."
      );
      expect(_.get(body, "type")).to.equal(
        "ReturnStatement",
        "You should `return` the value of `Promise.all(...)`"
      );
      expect(
        _.get(body, "argument.callee.object.callee.object.callee.object.name")
      ).to.equal("Promise", "You should use `Promise.all(...)`");
      expect(
        _.get(body, "argument.callee.object.callee.object.callee.property.name")
      ).to.equal("all", "Use the `all()` method on the `Promise` object");
    } else {
      const promiseResultParams = _.get(
        funcDec,
        "body.body[0].argument.callee.object.arguments[0].params[0]",
        ""
      );
      const body = _.get(funcDec, "body.body[0]", "");

      expect(_.get(body, "type")).to.equal(
        "ReturnStatement",
        "You should `return` the value of `Promise.all(...)`"
      );
      expect(
        _.get(body, "argument.callee.object.callee.object.callee.object.name")
      ).to.equal("Promise", "You should use `Promise.all(...)`");
      expect(
        _.get(body, "argument.callee.object.callee.object.callee.property.name")
      ).to.equal("all", "Use the `all()` method on the `Promise` object");
      expect(_.get(promiseResultParams, "elements[0].name", "")).to.equal(
        "books",
        "You should pass `books` as the first array item in the parameter."
      );
      expect(_.get(promiseResultParams, "elements[1].name", "")).to.equal(
        "movies",
        "You should pass `movies` as the second array item in the parameter."
      );
    }
  });

  it("should execute `getBooksAndMovies()` and log the results @log-books-and-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const getBooksAndMoviesPromise = _.get(res, "body[3]");

    expect(
      _.get(getBooksAndMoviesPromise, "declarations[0].init.callee.name", "")
    ).to.equal(
      "getBooksAndMovies",
      "`getBooksAndMoviesPromise` should be initialized with a call of `getBooksAndMovies()`."
    );

    const getBooksAndMoviesResults = _.get(res, "body[4]");
    expect(
      _.get(getBooksAndMoviesResults, "expression.callee.object.name", "")
    ).to.equal(
      "getBooksAndMoviesPromise",
      "You should resolve the `getBooksAndMoviesPromise` with `.then()`."
    );
    expect(
      _.get(getBooksAndMoviesResults, "expression.callee.property.name", "")
    ).to.equal("then", "You need to resolve the promise using `.then()`");
    expect(
      _.get(
        getBooksAndMoviesResults,
        "expression.arguments[0].params[0].name",
        ""
      )
    ).to.equal(
      "results",
      "In the `.then()` callback, pass `results` as the only parameter."
    );

    expect(
      _.get(
        getBooksAndMoviesResults,
        "expression.arguments[0].body.body[0].expression.callee.object.name",
        ""
      ) === "console" &&
        _.get(
          getBooksAndMoviesResults,
          "expression.arguments[0].body.body[0].expression.callee.property.name",
          ""
        ) === "log" &&
        _.get(
          getBooksAndMoviesResults,
          "expression.arguments[0].body.body[0].expression.arguments[0].value",
          ""
        ) === "getBooksAndMoviesPromise" &&
        _.get(
          getBooksAndMoviesResults,
          "expression.arguments[0].body.body[0].expression.arguments[1].name",
          ""
        ) === "results"
    ).to.equal(
      true,
      "In the `.then()` callback, you should use `console.log` to log the `results`."
    );
  });

  it("should use `Promise.race()` to execute multiple promises and proceed when one of them finishes @get-books-or-movies-with-promise-race", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const funcDec = res.body.filter(
      node =>
        _.get(node, "type", "") === "FunctionDeclaration" &&
        _.get(node, "id.name", "") === "getBooksOrMovies"
    )[0];

    const varDec = res.body.filter(
      node =>
        _.get(node, "type", "") === "VariableDeclaration" &&
        _.get(node, "declarations[0].id.name") === "getBooksOrMovies"
    )[0];
    if (varDec) {
      const promiseResultParams = _.get(
        varDec,
        "declarations[0].init.body.body[0].argument.callee.object.arguments[0].params[0]",
        ""
      );
      const body = _.get(varDec, "declarations[0].init.body.body[0]", "");
      expect(_.get(promiseResultParams, "name", "")).to.equal(
        "results",
        "You should pass `results` as the first array item in the parameter."
      );

      expect(_.get(body, "type")).to.equal(
        "ReturnStatement",
        "You should `return` the value of `Promise.race(...)`"
      );
      expect(
        _.get(body, "argument.callee.object.callee.object.callee.object.name")
      ).to.equal("Promise", "You should use `Promise.race(...)`");
      expect(
        _.get(body, "argument.callee.object.callee.object.callee.property.name")
      ).to.equal("race", "Use the `race()` method on the `Promise` object");
    } else {
      const promiseResultParams = _.get(
        funcDec,
        "body.body[0].argument.callee.object.arguments[0].params[0]",
        ""
      );
      const body = _.get(funcDec, "body.body[0]", "");

      expect(_.get(body, "type")).to.equal(
        "ReturnStatement",
        "You should `return` the value of `Promise.race(...)`"
      );
      expect(
        _.get(body, "argument.callee.object.callee.object.callee.object.name")
      ).to.equal("Promise", "You should use `Promise.race(...)`");
      expect(
        _.get(body, "argument.callee.object.callee.object.callee.property.name")
      ).to.equal("race", "Use the `reace()` method on the `Promise` object");
      expect(_.get(promiseResultParams, "name", "")).to.equal(
        "results",
        "You should pass `results` as the first array item in the parameter."
      );
    }
  });

  it("should execute `getBooksOrMovies()` and log the results @log-books-or-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const getBooksOrMoviesPromise = _.get(res, "body[6]");
    expect(
      _.get(getBooksOrMoviesPromise, "declarations[0].init.callee.name", "")
    ).to.equal(
      "getBooksOrMovies",
      "`getBooksOrMoviesPromise` should be initialized with a call of `getBooksOrMovies()`."
    );

    const getBooksOrMoviesResults = _.get(res, "body[7]");
    expect(
      _.get(getBooksOrMoviesResults, "expression.callee.object.name", "")
    ).to.equal(
      "getBooksOrMoviesPromise",
      "You should resolve the `getBooksOrMoviesPromise` with `.then()`."
    );
    expect(
      _.get(getBooksOrMoviesResults, "expression.callee.property.name", "")
    ).to.equal("then", "You need to resolve the promise using `.then()`");
    expect(
      _.get(
        getBooksOrMoviesResults,
        "expression.arguments[0].params[0].name",
        ""
      )
    ).to.equal(
      "results",
      "In the `.then()` callback, pass `results` as the only parameter."
    );

    expect(
      _.get(
        getBooksOrMoviesResults,
        "expression.arguments[0].body.body[0].expression.callee.object.name",
        ""
      ) === "console" &&
        _.get(
          getBooksOrMoviesResults,
          "expression.arguments[0].body.body[0].expression.callee.property.name",
          ""
        ) === "log" &&
        _.get(
          getBooksOrMoviesResults,
          "expression.arguments[0].body.body[0].expression.arguments[0].value",
          ""
        ) === "getBooksOrMoviesPromise" &&
        _.get(
          getBooksOrMoviesResults,
          "expression.arguments[0].body.body[0].expression.arguments[1].name",
          ""
        ) === "results"
    ).to.equal(
      true,
      "In the `.then()` callback, you should use `console.log` to log the `results`."
    );
  });
});
