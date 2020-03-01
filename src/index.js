export function fetchMovies() {
  const resolveFunction = () => movies;
  return fetchWithTimeout(1000).then(resolveFunction);
}
