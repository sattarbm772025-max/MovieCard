import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import "../styles/Favorites.css";

function Favorites() {

  const [favorites, setFavorites] =
    useState([]);

  useEffect(() => {

    const data =
      JSON.parse(
        localStorage.getItem(
          "favorites"
        )
      ) || [];

    setFavorites(data);

  }, []);

  const removeMovie = (id) => {

    const updated =
      favorites.filter(
        (movie) =>
          movie.id !== id
      );

    setFavorites(updated);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="favorites-page">

      <Navbar />

      <h1 className="favorites-title">
        ❤️ Favorite Movies
      </h1>

      {favorites.length === 0 ? (

        <div className="empty-state">

          <h2>
            ❤️ No Favorites Yet
          </h2>

          <p>
            Add movies from Home page
          </p>

        </div>

      ) : (

        <div className="favorites-grid">

          {favorites.map(
            (movie) => (

              <div
                key={movie.id}
                className="favorite-card"
              >

                <img
                  src={movie.poster}
                  alt={movie.title}
                />

                <h2>
                  {movie.title}
                </h2>

                <p>
                  {movie.genre}
                </p>

                <button
                  onClick={() =>
                    removeMovie(
                      movie.id
                    )
                  }
                >
                  Remove
                </button>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Favorites;