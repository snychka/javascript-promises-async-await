const movies = require("./data/movies.json");
const books = require("./data/books.json");
function fetch(type) {
  return type === "movies" ? Promise.resolve(movies) : Promise.resolve(books);
}

export function fetchWithTimeout(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function fetchMovies() {
  return fetch("/data/movies.json")
    .then(movies => movies)
    .catch(error => console.log(error));
}

export function fetchBooks() {
  return fetch("/data/books.json")
    .then(books => books)
    .catch(error => console.log(error));
}

export async function asyncFetchMovies() {
  try {
    const results = await fetch("/data/movies.json");
    return results;
  } catch (error) {
    console.log(error);
  }
}

export async function asyncFetchBooks() {
  try {
    const results = await fetch("/data/books.json");
    return results;
  } catch (error) {
    console.log(error);
  }
}
