import {
  fetchWithTimeout,
  fetchBooks,
  fetchMovies,
  asyncFetchBooks,
  asyncFetchMovies
} from "./services";
const movies = require("./data/movies.json");

export function fetchMovies_() {
  const resolveFunction = () => movies;
  return fetchWithTimeout(1000).then(resolveFunction);
}

const moviePromise = fetchMovies_();
moviePromise.then(results => {
  console.log(results);
});

function getBooksAndMovies() {
  return Promise.all([fetchBooks(), fetchMovies()])
    .then(({ books, movies }) => ({
      books,
      movies
    }))
    .catch(error => console.log("Error fetching books and movies", error));
}

const getBooksAndMoviesPromise = getBooksAndMovies();
getBooksAndMoviesPromise.then(results => {
  console.log("getBooksAndMoviesPromise", results);
});

function getBooksOrMovies() {
  return Promise.race([fetchBooks(), fetchMovies()])
    .then(results => results)
    .catch(error => {
      console.log("Error waiting for the promise race", error);
    });
}
const getBooksOrMoviesPromise = getBooksOrMovies();
getBooksOrMoviesPromise.then(results => {
  console.log("getBooksOrMoviesPromise", results);
});

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
  return fetchWithTimeout(1000).then(() => moviies);
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
