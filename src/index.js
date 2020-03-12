import { fetchWithTimeOut } from "./services";
let movies = require('./data/movies.json');
export function fetchMovies() {
 const resolveFunction = () => movies;
 return fetchWithTimeout(1000).then(resolveFunction);
 return new Promise(resolve => setTimeout(resolve, delay)); 
}

let moviePromise = fetchMovies();
moviePromise.then( function(results) {console.log(results);});
