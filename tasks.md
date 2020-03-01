## Task 1: Creating the entry point

Create a file in the `/src/` directory called `index.js`

## Task 2: Declare the fetchMovies method

Create an empty, exported function named `fetchMovies()`.

## Task 3: Add services file @services

Create a file in the `/src/` directory called `services.js`.

## Task 4: Create method to simulate promise with a delay @settimeout-promise

Inside of `services.js`, create an exported function named `fetchWithTimeout` that accepts a single argument named `delay`.

## Task 5: Add promise to the fetchWithTimeout method @http-delay

Inside the body of `fetchWithTimeout` return a promise that uses a timeout that simulates an HTTP delay. Use the following code:

```js
return new Promise(resolve => setTimeout(resolve, delay));
```
