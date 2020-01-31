export function fetchMovies() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
    }, 1000);
  });
}

const moviePromise = fetchMovies();
moviePromise.then(results => {
  console.log(results);
});
