import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/axios";

import "../styles/Favorites.css";

function Favorites() {

  const [favorites, setFavorites] =
    useState([]);

  const [removingId, setRemovingId] =
    useState("");

  const loadFavorites =
    useCallback(async () => {

      try {

        const response =
          await API.get("/favorites");

        setFavorites(response.data);

      } catch {

        setFavorites([]);
      }
    }, []);

  useEffect(() => {

    loadFavorites();

  }, [loadFavorites]);

  const removeMovie = async (id) => {

    try {

      setRemovingId(id);

      await API.delete(
        `/favorites/${id}`
      );

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (movie) =>
            movie.movie_id !== id &&
            String(movie.id) !== String(id)
        )
      );

      toast.success("Removed from Favorites");

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to remove favorite"
      );

      loadFavorites();

    } finally {

      setRemovingId("");
    }
  };

  const getFavoriteId = (movie) =>
    movie.movie_id || String(movie.id);

  const getPoster = (movie) =>
    movie.poster &&
    movie.poster !== "N/A"
      ? movie.poster
      : "https://via.placeholder.com/300x450";

  const getTitle = (movie) =>
    movie.title || "Untitled Movie";

  return (
    <div className="favorites-page">

      <Navbar />

      <header className="favorites-header">
        <div>
          <h1 className="favorites-title">
            Favorite Movies
          </h1>

          <p>
            Your saved posters, ready for a rewatch.
          </p>
        </div>
      </header>

      {favorites.length === 0 ? (

        <div className="empty-state">
          <h2>No Favorites Yet</h2>
          <p>Add movies from Home page</p>
        </div>

      ) : (

        <div className="favorites-grid">
          {favorites.map((movie) => {

            const favoriteId =
              getFavoriteId(movie);

            const isRemoving =
              removingId === favoriteId;

            return (
              <div
                key={favoriteId}
                className="favorite-card"
              >
                <img
                  src={getPoster(movie)}
                  alt={getTitle(movie)}
                />

                <h2>
                  {getTitle(movie)}
                </h2>

                <button
                  type="button"
                  disabled={isRemoving}
                  onClick={() =>
                    removeMovie(favoriteId)
                  }
                >
                  {isRemoving
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            );
          })}
        </div>

      )}

      <Footer />
    </div>
  );
}

export default Favorites;
