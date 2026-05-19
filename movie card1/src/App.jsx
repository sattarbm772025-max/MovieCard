import { useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import Filter from "./components/Filter";
import "./App.css";

function App() {
  const moviesData = [
    {
      id: 1,
      title: "Vikram",
      genre: "Action",
      rating: 8.4,
      description:
        "A special agent investigates a drug syndicate and uncovers a hidden criminal empire.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/9/93/Vikram_2022_poster.jpg",
    },

    {
      id: 2,
      title: "Sita Ramam",
      genre: "Romance",
      rating: 8.6,
      description:
        "An orphan soldier's life changes after receiving a letter from a girl named Sita.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/1/1d/Sita_Ramam.jpg",
    },

    {
      id: 3,
      title: "Jailer",
      genre: "Thriller",
      rating: 7.5,
      description:
        "A retired jailer goes on a mission after his son goes missing.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/c/cb/Jailer_2023_Tamil_film_poster.jpg",
    },
  ];

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [darkMode, setDarkMode] = useState(true);

  const filteredMovies = moviesData.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      genre === "All" || movie.genre === genre;

    return matchesSearch && matchesGenre;
  });

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="top-bar">
        <h1>🎬 Movie Listing App</h1>

        <button
          className="toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <SearchBar search={search} setSearch={setSearch} />

      <Filter genre={genre} setGenre={setGenre} />

      <div className="movie-container">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <h2>No movies found</h2>
        )}
      </div>
    </div>
  );
}

export default App;