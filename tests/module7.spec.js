const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const walk = require("acorn-walk");
const _ = require("lodash");

describe("Module 7", () => {
  it("should import the new async functions `asyncFetchBooks()` and `asyncFetchMovies()` from services.js @import-new-async-functions", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const allImports = [];
    walk.simple(res, {
      ImportDeclaration(node) {
        if (node.source.value === "./services") {
          const results = node.specifiers.reduce((acc, val) => {
            acc.push(val.imported.name);
            return acc;
          }, []);
          allImports.push(...results);
        }
      }
    });
    expect(allImports.includes("asyncFetchBooks")).to.equal(
      true,
      "You must import `asyncFetchBooks` from services.js"
    );
    expect(allImports.includes("asyncFetchMovies")).to.equal(
      true,
      "You must import `asyncFetchMovies` from services.js"
    );
  });

  it("should have async function `getBooksAndMoviesAsync()` @create-async-get-books-and-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const localFunctions = [];
    walk.simple(res, {
      FunctionDeclaration(node) {
        if (_.get(node, "id.name", "") === "getBooksAndMoviesAsync") {
          localFunctions.push(node);
        }
      },
      VariableDeclaration(node) {
        if (
          _.get(node, "declarations[0].id.name", "") ===
          "getBooksAndMoviesAsync"
        ) {
          localFunctions.push(node);
        }
      }
    });
    expect(
      localFunctions[0].declarations
        ? _.get(localFunctions[0], "declarations[0].id.name", "")
        : _.get(localFunctions[0], "id.name", "")
    ).to.equal(
      "getBooksAndMoviesAsync",
      "You must have an asnyc function named getBooksAndMoviesAsync() defined."
    );
  });

  it("should have a try/catch block in `getBooksAndMoviesAsync()` @try-catch-in-async-get-books-and-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const func = {};
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
    const catchWalk = {};
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
    expect(tryBlocks.length).to.equal(1);
    expect(catchWalk.Literal).to.equal(
      "Error fetching books and movies",
      "You should log the message `Error fetching books and movies` in the catch clause."
    );
    expect(_.get(catchWalk["MemberExpression"], "object.name", "")).to.equal(
      "console",
      "You should be logging the results via the `console` object."
    );
    expect(_.get(catchWalk["MemberExpression"], "property.name", "")).to.equal(
      "log",
      "You should be logging the results with the `log` method on the `console` object."
    );
    expect(catchWalk["Identifier"].name).to.equal(
      "error",
      "You should also log the `error` object in the catch clause."
    );
  });

  it("should use Promise.all() to await the results @call-and-await-promise-all", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const func = {};
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
    const tryBlock = {};
    walk.simple(func.node, {
      TryStatement(node) {
        tryBlock.TryStatement = node;
      }
    });

    walk.simple(tryBlock.TryStatement, {
      ReturnStatement(node) {
        // console.dir(node, { depth: 6 });
        tryBlock.ReturnStatement = node;
      },
      VariableDeclarator(node) {
        tryBlock.VariableDeclarator = node;
      },
      VariableDeclaration(node) {
        tryBlock.VariableDeclaration = node;
      },
      AwaitExpression(node) {
        tryBlock.AwaitExpression = node;
      },
      MemberExpression(node) {
        if (_.get(node, "object.name", "") === "Promise") {
          tryBlock.MemberExpression = node;
        }
      }
    });

    walk.simple(tryBlock.VariableDeclaration, {
      CallExpression(node) {
        tryBlock.CallExpression = node;
      },
      ArrayExpression(node) {
        tryBlock.ArrayExpression = node;
      }
    });

    expect(_.get(tryBlock.MemberExpression, "object.name", "")).to.equal(
      "Promise"
    );
    expect(_.get(tryBlock.MemberExpression, "property.name", "")).to.equal(
      "all"
    );

    expect(
      _.get(tryBlock.VariableDeclarator, "id.elements[0].name", "")
    ).to.equal(
      "books",
      "You should set the first var in the destructered variable declaration to `books`."
    );
    expect(
      _.get(tryBlock.VariableDeclarator, "id.elements[1].name", "")
    ).to.equal(
      "movies",
      "You should set the second var in the destructered variable declaration to `movies`."
    );

    expect(
      _.get(tryBlock.ArrayExpression, "elements[0].callee.name", "")
    ).to.equal(
      "asyncFetchBooks",
      "You need to pass an array to `Promise.all([asyncFetchBooks(), asyncFetchMovies()])` that includes `asyncFetchBooks()` at the first index position."
    );
    expect(
      _.get(tryBlock.ArrayExpression, "elements[1].callee.name", "")
    ).to.equal(
      "asyncFetchMovies",
      "You need to pass an array to `Promise.all([asyncFetchBooks(), asyncFetchMovies()])` that includes `asyncFetchMovies()` at the second index position."
    );
  });

  it("should return both books and movies as an object @return-books-and-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const func = {};
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
    const tryBlock = {};
    walk.simple(func.node, {
      TryStatement(node) {
        tryBlock.TryStatement = node;
      }
    });

    walk.simple(tryBlock.TryStatement, {
      ReturnStatement(node) {
        tryBlock.ReturnStatement = node;
      }
    });

    expect(
      _.get(tryBlock.ReturnStatement, "argument.properties[0].key.name", "")
    ).to.be.oneOf(
      ["books", "movies"],
      "You should return an object with the keys `books` and `movies` equal to their respective variables defined above."
    );
    expect(
      _.get(tryBlock.ReturnStatement, "argument.properties[1].key.name", "")
    ).to.be.oneOf(
      ["books", "movies"],
      "You should return an object with the keys `books` and `movies` equal to their respective variables defined above."
    );
  });

  it("should have async function `getBooksOrMoviesAsync()` @create-async-get-books-or-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
    const localFunctions = [];
    walk.simple(res, {
      FunctionDeclaration(node) {
        if (_.get(node, "id.name", "") === "getBooksOrMoviesAsync") {
          localFunctions.push(node);
        }
      },
      VariableDeclaration(node) {
        if (
          _.get(node, "declarations[0].id.name", "") === "getBooksOrMoviesAsync"
        ) {
          localFunctions.push(node);
        }
      }
    });
    expect(
      localFunctions[0].declarations
        ? _.get(localFunctions[0], "declarations[0].id.name", "")
        : _.get(localFunctions[0], "id.name", "")
    ).to.equal(
      "getBooksOrMoviesAsync",
      "You must have an asnyc function named getBooksOrMoviesAsync() defined."
    );
  });

  it("should have a try/catch block in `getBooksOrMoviesAsync()` @add-try-block-get-books-or-movies", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
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
    const catchWalk = {};
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
    expect(tryBlocks.length).to.equal(1);
    expect(catchWalk.Literal).to.equal(
      "Error waiting for the promise race",
      "You should log the message `Error waiting for the promise race` in the catch clause."
    );
    expect(_.get(catchWalk["MemberExpression"], "object.name", "")).to.equal(
      "console",
      "You should be logging the results via the `console` object."
    );
    expect(_.get(catchWalk["MemberExpression"], "property.name", "")).to.equal(
      "error",
      "You should be logging the results with the `log` method on the `console` object."
    );
    expect(catchWalk["Identifier"].name).to.equal(
      "error",
      "You should also log the `error` object in the catch clause."
    );
  });

  it("should use Promise.race() to await the results @call-promise-race", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
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
          func.node = node;
        }
      }
    });
    const tryBlock = {};
    walk.simple(func.node, {
      TryStatement(node) {
        tryBlock.TryStatement = node;
      }
    });

    walk.simple(tryBlock.TryStatement, {
      ReturnStatement(node) {
        tryBlock.ReturnStatement = node;
      },
      VariableDeclarator(node) {
        tryBlock.VariableDeclarator = node;
      },
      VariableDeclaration(node) {
        tryBlock.VariableDeclaration = node;
      },
      AwaitExpression(node) {
        tryBlock.AwaitExpression = node;
      },
      MemberExpression(node) {
        if (_.get(node, "object.name", "") === "Promise") {
          tryBlock.MemberExpression = node;
        }
      }
    });

    walk.simple(tryBlock.VariableDeclaration, {
      CallExpression(node) {
        tryBlock.CallExpression = node;
      },
      ArrayExpression(node) {
        tryBlock.ArrayExpression = node;
      }
    });

    expect(_.get(tryBlock.MemberExpression, "object.name", "")).to.equal(
      "Promise",
      "You need to use the Promise object to call the `race` method."
    );
    expect(_.get(tryBlock.MemberExpression, "property.name", "")).to.equal(
      "race",
      "You need to call the `race()` method on the Promise object."
    );

    expect(_.get(tryBlock.VariableDeclarator, "id.name", "")).to.equal(
      "values",
      "You should set the value of the Promise.race call to `values`."
    );

    expect(
      _.get(tryBlock.ArrayExpression, "elements[0].callee.name", "")
    ).to.equal(
      "asyncFetchBooks",
      "You need to pass an array to `Promise.race([asyncFetchBooks(), asyncFetchMovies()])` that includes `asyncFetchBooks()` at the first index position."
    );
    expect(
      _.get(tryBlock.ArrayExpression, "elements[1].callee.name", "")
    ).to.equal(
      "asyncFetchMovies",
      "You need to pass an array to `Promise.race([asyncFetchBooks(), asyncFetchMovies()])` that includes `asyncFetchMovies()` at the second index position."
    );
  });

  it("should return results of the race @promise-race-return-results", () => {
    let file = fs.readFileSync(
      path.join(process.cwd(), "src/index.js"),
      "utf8"
    );
    const res = acorn.parse(file, { sourceType: "module" });
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
          func.node = node;
        }
      }
    });
    const tryBlock = {};
    walk.simple(func.node, {
      TryStatement(node) {
        tryBlock.TryStatement = node;
      }
    });

    walk.simple(tryBlock.TryStatement, {
      ReturnStatement(node) {
        tryBlock.ReturnStatement = node;
      }
    });

    expect(_.get(tryBlock.ReturnStatement, "argument.name", "")).to.equal(
      "values",
      "You should return the `values` variable."
    );
  });

  it("should log the results of getBooksAndMovies @exec-getbooksandmovies-log", () => {
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
        if (_.get(node, "params[0].name", "") === "results") {
          func.raceThenNode = node;
        }
      }
    });

    walk.simple(func.raceThenNode, {
      CallExpression(node) {
        func.raceThenBody = node;
      }
    });

    // Using console.log
    expect(_.get(func.raceThenBody, "callee.object.name", "")).to.equal(
      "console",
      "Make sure to use the `console` object for logging"
    );
    expect(_.get(func.raceThenBody, "callee.property.name", "")).to.equal(
      "log",
      "Make sure to use the `log()` method on the `console` object"
    );

    // logging the correct message
    expect(
      _.get(func.raceThenBody, "arguments[1].properties[0].key.name", "")
    ).to.be.oneOf(
      ["movies", "books"],
      "You should log both `movies` and `book` in an object."
    );
    expect(
      _.get(func.raceThenBody, "arguments[1].properties[1].key.name", "")
    ).to.be.oneOf(
      ["movies", "books"],
      "You should log both `movies` and `book` in an object."
    );
  });

  it("should log the results of getBooksOrMovies @exec-getbooksoromovies-log", () => {
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
          "getBooksOrMoviesAsync"
      ) {
        parent.node = node;
      }
    });

    walk.ancestor(parent.node, {
      ArrowFunctionExpression(node, ancestors) {
        // ancestors.map(val => console.dir(val, { depth: 8 }));
        if (_.get(node, "params[0].name", "") === "results") {
          func.raceThenNode = node;
        }
      }
    });

    walk.simple(func.raceThenNode, {
      CallExpression(node) {
        func.raceThenBody = node;
      }
    });

    // Using console.log
    expect(_.get(func.raceThenBody, "callee.object.name", "")).to.equal(
      "console",
      "Make sure to use the `console` object for logging"
    );
    expect(_.get(func.raceThenBody, "callee.property.name", "")).to.equal(
      "log",
      "Make sure to use the `log()` method on the `console` object"
    );

    // logging the correct message
    expect(
      _.get(func.raceThenBody, "arguments[1].properties[0].key.name", "")
    ).to.equal("results", "You should log `results` in an object.");
  });
});
