const COMPARE_STORAGE_KEY =
  "moviecard_compare_selection";

const COMPARE_EVENT =
  "moviecard_compare_selection_changed";

export function getCompareSelection() {

  try {

    return JSON.parse(
      localStorage.getItem(COMPARE_STORAGE_KEY)
    ) || [];

  } catch {

    return [];
  }
}

export function saveCompareSelection(movies) {

  localStorage.setItem(
    COMPARE_STORAGE_KEY,
    JSON.stringify(movies)
  );

  window.dispatchEvent(
    new CustomEvent(COMPARE_EVENT, {
      detail: movies,
    })
  );
}

export function toggleCompareMovie(movie) {

  const currentMovies =
    getCompareSelection();

  const exists =
    currentMovies.some(
      (item) => item.id === movie.id
    );

  if (exists) {

    const nextMovies =
      currentMovies.filter(
        (item) => item.id !== movie.id
      );

    saveCompareSelection(nextMovies);

    return {
      selected: false,
      movies: nextMovies,
      message: "Removed from comparison",
    };
  }

  if (currentMovies.length >= 2) {

    return {
      selected: false,
      movies: currentMovies,
      message: "You can compare only 2 movies",
      limitReached: true,
    };
  }

  const nextMovies = [
    ...currentMovies,
    {
      id: movie.id,
      title: movie.title,
      poster: movie.poster,
    },
  ];

  saveCompareSelection(nextMovies);

  return {
    selected: true,
    movies: nextMovies,
    message:
      nextMovies.length === 2
        ? "Ready to compare"
        : "Movie selected for comparison",
  };
}

export function clearCompareSelection() {

  saveCompareSelection([]);
}

export function isCompareMovieSelected(movieId) {

  return getCompareSelection().some(
    (item) => item.id === movieId
  );
}

export { COMPARE_EVENT };
