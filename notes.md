Start in the index.js file.

## Tasks Outline

### Module 2 - Simulate a fetch call with setTimeout

- Create a file in the `/src/` directory called `index.js`

- Create an empty, exported function named `fetchMovies()`.

- Create a file in the `/src/` directory called `services.js`.

- Inside of `services.js`, create an exported function named `fetchWithTimeout` that accepts a single argument named `delay`.

- Inside the body of `fetchWithTimeout` return a promise that uses a timeout that simulates an HTTP delay. Use the following code:

```js
return new Promise(resolve => setTimeout(resolve, delay));
```

---

# M3 - Fetching Movies with Traditional Promise

In this module we will fill in the `fetchMovies` function in `index.js`. Need to create the `/data/movies.json` file. Then we'll call `fetchMovies()`, assign that to `moviePromise`, do a `.then` and log out results.

## Create Folder to Store JSON @create-data-dir

- In the `/src/` directory create a folder called `data`.

## Add movies JSON Object @create-movies-json

- Inside of the new `src/data/` directory add a file named `movies.json`. Paste this JSON into `movies.json`:

```json
[
  {
    "title": "Die Hard"
  },
  {
    "title": "Home Alone"
  },
  {
    "title": "Love Actually"
  }
]
```

# Import movies to index @import-movies

- Back in `index.js` import the movies.json file by using `require` and setting the result to a variable called `movies`.

# Create the resolve method @create-resolve-function

- Within the `fetchMovies()` function body, create a variable called `resolveFunction` and set it's value as a function that returns `movies`:

```js
const resolveFunction = () => movies;
```

# Import fetchWithTimeout to index @import-fetch-with-timeout

- At the top of `index.js` import the `fetchWithTimeout` function from `./services`.

# Add return statement to fetchMovies @return-fetch-with-timeout

- Inside the `fetchMovies` function and after the `resolveFunction` variable, call and return `fetchWithTimeout`, passing 1000 as the delay argument. Add a `.then()` on `fetchWithTimeout` and pass `resolveFunction` as the callback.

# Execute the fetchMovies promise @execute-fetch-movies

- Execute `fetchMovies()` by creating a variable named `moviePromise` and set it's value to `fetchMovies()`.

# Log the results of the moviePromise object @log-movie-promise

- `moviePromise` is a promise object, so call `.then()` on the moviePromise variable, and in the resolve callback function pass `results` as the only argument. In the function body console log the results.

# M4 - Continue Execution After All Promises Finish
