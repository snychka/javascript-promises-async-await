# This is not the final list of tasks. This project is still at the proposal stage

## -

## -

## -

## -

## -

# Module 1

## Task 1: Creating the relevant module

Create a file called `services.js` in the `/src` directory.

## Task 2: Creating the fetch function

Inside of `services.js` export a function named `fetch`. `fetch` should take a single argument, delay. `delay` will represent the number of milliseconds to wait before resolving.

## Task 3: Adding a promise to fetch movies

In the function body of `fetch`, return a new promise. The promise callback should be an arrow function with a `resolve` parameter.

## Task 4: Simulate an API request within the promise

Inside the promise callback, add a `setTimeout`. Set the wait time to the variable `delay`. Pass the `resolve` param as the callback of the `setTimeout`.

# Module 2

## Task 1: Call fetch and log the results

Below the `fetchMovies` function declaration, call `fetchMovies` and set the result to a variable called `moviePromise`.

## Task 2: Resolve moviePromise

Call `moviePromise.then()`. The `.then` callback function has a single parameter, which is the promises resolved value. Name this parameter `results`, and `console.log` the results.
