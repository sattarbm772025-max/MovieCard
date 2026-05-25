import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import Filter from "./components/Filter";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("batman");
  const [genre, setGenre] = useState("All");
  const [darkMode, setDarkMode] = useState(true);

  // Fetch Movies
  const fetchMovies = async () => {
    try {
      // Search movies from backend
      const response = await fetch(
        `http://127.0.0.1:8000/movies/search?title=${search}`
      );

      const data = await response.json();

      console.log(data);

      if (data.Search) {
        // Fetch full details for each movie
        const formattedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailsResponse = await fetch(
              `http://127.0.0.1:8000/movies/${movie.imdbID}`
            );

            const details = await detailsResponse.json();

            return {
              id: movie.imdbID,
              title: movie.Title,

              genre: details.Genre
                ? details.Genre.split(",")[0]
                : "Unknown",

              rating: details.imdbRating || "N/A",

              description:
                details.Plot || "No description available",

              image:
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/300x450",
            };
          })
        );

        setMovies(formattedMovies);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Load default movies
  useEffect(() => {
    fetchMovies();
  }, []);

  // Genre Filter
  const filteredMovies = movies.filter((movie) => {
    if (genre === "All") return true;

    return movie.genre
      .toLowerCase()
      .includes(genre.toLowerCase());
  });

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* Header */}
      <div className="top-bar">
        <h1>🎬 Movie Listing App</h1>

        <button
          className="toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Search + Filter */}
      <div className="controls">
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <Filter
          genre={genre}
          setGenre={setGenre}
        />

        <button
          className="search-btn"
          onClick={fetchMovies}
        >
          Search
        </button>
      </div>

      {/* Movies */}
      <div className="movie-container">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))
        ) : (
          <h2>No movies found</h2>
        )}
      </div>
    </div>
  );
}

export default App;