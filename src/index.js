import {
  fetchWithTimeout,
  fetchBooks,
  fetchMovies,
  asyncFetchBooks,
  asyncFetchMovies
} from "./services";
const movies = require("./data/movies.json");

export function fetchMovies() {
  const resolveFunction = () => movies;
  return fetchWithTimeout(1000).then(resolveFunction);
}

const moviePromise = fetchMovies();
moviePromise.then(results => {
  console.log(results);
});

async function getBooksAndMovies() {
  try {
    const [books, movies] = await Promise.all([fetchBooks(), fetchMovies()]);
    return {
      books,
      movies
    };
  } catch (error) {
    console.log("Error fetching books and movies", error);
  }
}

async function getBooksOrMovies() {
  try {
    const values = await Promise.race([fetchBooks(), fetchMovies()]);
    return values;
  } catch (error) {
    console.log("Error waiting for the promise race", error);
  }
}

async function getBooksAndMoviesAsync() {
  try {
    const [books, movies] = await Promise.all([
      asyncFetchBooks(),
      asyncFetchMovies()
    ]);
    return {
      books,
      movies
    };
  } catch (error) {
    console.log("Error fetching books and movies", error);
  }
}

async function getBooksOrMoviesAsync() {
  try {
    const values = await Promise.race([asyncFetchBooks(), asyncFetchMovies()]);
    return values;
  } catch (error) {
    console.log("Error waiting for the promise race", error);
  }
}

function fetchMoviesWithError() {
  return fetch_(1000).then(() => moviies);
}

fetchMovies_().then(res => console.log("Received list of movies", res));

fetchMoviesWithError()
  .then(res => console.log("shouldn't receive movies", res))
  .catch(err => console.log("Oops!", err));

const timer1 = setTimeout(() => {
  console.log("timer 1 has finished");
}, 20000);

const timer2 = setTimeout(() => {
  console.log("timer 2 has finished");
  clearTimeout(timer1);
}, 2000);

getBooksOrMoviesAsync()
  .then(res => console.log("async results:", res))
  .catch(err => console.error(err));
