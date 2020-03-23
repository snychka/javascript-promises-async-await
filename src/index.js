import { fetchMovies, fetchBooks, asyncFetchBooks, asyncFetchMovies } from "./services";
import { fetchWithTimeout } from "./services";
let movies = require('./data/movies.json');

function getBooksAndMovies() {
//const getBooksAndMovies = () => {
  return Promise.all([fetchBooks(), fetchMovies()])
  .then(([books, movies ]) => ({
      books,
      movies
    }))
    .catch(error => console.log("Error fetching books and movies", error));
}

const getBooksAndMoviesPromise = getBooksAndMovies();
async function getBooksAndMoviesAsync() {
  /*
   * In the try block, await the call to Promise.all(). The argument to pass to Promise.all() should be an array where the first item is asyncFetchBooks(), and the 2nd item is asyncFetchMovies(). You'll want to return the result of this call to a destructured array. Right before the await Promise.all() call, add const [books, movies] =.
   */
  try {
    const [books, movies] = await Promise.all([asyncFetchBooks(), asyncFetchMovies()]);
    return {books, movies };
  } catch(error) {
    console.log("Error fetching books and movies", error);
  }
}

async function getBooksOrMoviesAsync() {
  try {
  } catch(error) {
    console.log("Error waiting for the promise race", error);
  }
}

getBooksAndMoviesPromise.then( results => { console.log('getBooksAndMoviesPromise', results); } );

function getBooksOrMovies() {
  return Promise.race([fetchBooks(), fetchMovies()])
  .then(results => results)
  .catch(error => console.log("Error waiting for the promise race", error));
}

const getBooksOrMoviesPromise = getBooksOrMovies();
getBooksOrMoviesPromise.then( results => { console.log('getBooksOrMoviesPromise', results); });

/*
export function fetchMovies() {
 const resolveFunction = () => movies;
 return fetchWithTimeout(1000).then(resolveFunction);
}
*/

/*
let moviePromise = fetchMovies();
moviePromise.then( function(results) {console.log(results);});
*/
