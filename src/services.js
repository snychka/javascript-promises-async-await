export function fetchWithTimeout(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function fetchMovies() {
  return fetch("./data/movies.json")
    .then(movies => movies.json())
    .catch(error => console.log(error));
}

export function fetchBooks() {
  return fetch("./data/books.json")
    .then(movies => movies.json())
    .catch(error => console.log(error));
}

export async function asyncFetchMovies() {
  try {
    const results = await fetch("./data/movies.json");
    const json = await results.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

export async function asyncFetchBooks() {
  try {
    const results = await fetch("./data/books.json");
    const json = await results.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}
