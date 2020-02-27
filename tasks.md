## Task 1: Creating the relevant module

Create a file called `promises.js` in the `/src` directory.

## Task 2: Creating the fetchMovies function

Inside of `promises.js` export a function named `fetchMovies`. `fetchMovies` should take 0 (zero) arguments.

## Task 3: Adding a promise to fetchMovies

In the function body of `fetchMovies`, return a new promise. The promise callback should be an arrow function with a `resolve` parameter and a `reject` parameter.

## Task 4: Simulate an API request within the promise

Inside the promise callback, add a `setTimeout` for 1000 milliseconds, where the callback of the `setTimeout` contains this content:

```js
resolve([
  {
    title: "Die Hard"
  },
  {
    title: "Home Alone"
  },
  {
    title: "Love Actually"
  }
]);
```

## Task 5: Call fetch movies and log the results

Below the `fetchMovies` function declaration, call `fetchMovies` and set the result to a variable called `moviePromise`.

## Task 6: Resolve moviePromise

Call `moviePromise.then()`. The `.then` callback function has a single parameter, which is the promises resolved value. Name this parameter `results`, and `console.log` the results.
