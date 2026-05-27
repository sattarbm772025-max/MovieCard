import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import "../styles/Favorites.css";

function Watchlist() {

  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {

    const data =
      JSON.parse(localStorage.getItem("watchlist")) || [];

    setWatchlist(data);

  }, []);

  const removeMovie = (id) => {

    const updated = watchlist.filter(
      (movie) => movie.id !== id
    );

    setWatchlist(updated);

    localStorage.setItem(
      "watchlist",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="favorites-page">

      <Navbar />

      <h1 className="favorites-title">
        👁 Watchlist
      </h1>

      <div className="favorites-grid">

        {watchlist.map((movie) => (

          <div
            key={movie.id}
            className="favorite-card"
          >

            <img
              src={movie.poster}
              alt={movie.title}
            />

            <h2>{movie.title}</h2>

            <p>{movie.genre}</p>

            <button
              onClick={() => removeMovie(movie.id)}
            >
              Remove
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Watchlist;