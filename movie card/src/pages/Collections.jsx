import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/Collections.css";

function Collections() {

  const [collections, setCollections] =
    useState([]);

  const [discoverCollections, setDiscoverCollections] =
    useState([]);

  const [movies, setMovies] =
    useState({});

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [movieId, setMovieId] =
    useState("");

  const [movieTitle, setMovieTitle] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [openCollectionId, setOpenCollectionId] =
    useState(null);

  const loadCollections = async () => {

    try {

      const response =
        await API.get("/collections");

      setCollections(response.data);

      const movieEntries =
        await Promise.all(
          response.data.map(
            async (collection) => {

              const movieResponse =
                await API.get(
                  `/collections/${collection.id}/movies`
                );

              return [
                collection.id,
                movieResponse.data,
              ];
            }
          )
        );

      setMovies(
        Object.fromEntries(movieEntries)
      );

      const discoverResponse =
        await API.get("/collections/discover");

      setDiscoverCollections(
        discoverResponse.data
      );

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to load collections"
      );
    }
  };

  useEffect(() => {

    loadCollections();

  }, []);

  const createCollection = async () => {

    if (!name.trim()) {
      toast.error("Enter collection name");
      return;
    }

    try {

      await API.post(
        "/collections",
        {
          name,
          description,
        }
      );

      setName("");
      setDescription("");
      toast.success("Collection created");
      loadCollections();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to create collection"
      );
    }
  };

  const deleteCollection = async (id) => {

    try {

      await API.delete(
        `/collections/${id}`
      );

      toast.success("Collection deleted");
      loadCollections();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to delete collection"
      );
    }
  };

  const addMovie = async (collectionId) => {

    if (!movieId) {
      toast.error("Select a movie");
      return;
    }

    try {

      await API.post(
        `/collections/${collectionId}/movies`,
        {
          movie_id: movieId,
          title: movieTitle,
          poster: "",
          genre: "",
        }
      );

      setMovieId("");
      setMovieTitle("");
      setSearch("");
      setSearchResults([]);
      toast.success("Movie added");
      loadCollections();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to add movie"
      );
    }
  };

  const removeMovie = async (
    collectionId,
    selectedMovieId
  ) => {

    try {

      await API.delete(
        `/collections/${collectionId}/movies/${selectedMovieId}`
      );

      toast.success("Movie removed");
      loadCollections();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to remove movie"
      );
    }
  };

  const followCollection = async (collectionId) => {

    try {

      await API.post(
        `/collections/${collectionId}/follow`
      );

      toast.success(
        "Collection followed"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to follow collection"
      );
    }
  };

  const searchMovies = async (title) => {

    if (!title.trim()) {
      setSearchResults([]);
      return;
    }

    try {

      const response =
        await API.get(
          `/movies/search?title=${encodeURIComponent(title)}`
        );

      setSearchResults(
        response.data.Search || []
      );

    } catch {

      setSearchResults([]);
    }
  };

  return (
    <div className="collections-page page-shell">
      <Navbar />

      <main className="collections-inner">
        <header className="collections-header">
          <div>
            <h1 className="page-title">
              Movie Collections
            </h1>

            <p className="page-subtitle">
              Build curated movie groups, add titles, and follow public collections.
            </p>
          </div>
        </header>

        <section className="collections-panel glass-panel">
          <h2>Create Collection</h2>

          <div className="collections-form">
            <input
              className="collections-input"
              type="text"
              placeholder="Collection name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <input
              className="collections-input"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            <button
              className="primary-action"
              onClick={createCollection}
            >
              Create Collection
            </button>
          </div>
        </section>

        <section className="collections-grid">
          {collections.map((collection) => (
            <article
              key={collection.id}
              className="collection-card glass-panel"
            >
              <div className="collection-card-top">
                <div>
                  <h2>
                    {collection.name}
                  </h2>

                  <p>
                    {collection.description ||
                      "No description added yet."}
                  </p>
                </div>

                <span className="collection-count">
                  {movies[collection.id]?.length || 0} Movies
                </span>
              </div>

              <div className="collection-actions">
                <button
                  className="danger-action"
                  onClick={() =>
                    deleteCollection(collection.id)
                  }
                >
                  Delete
                </button>

                <button
                  className="ghost-action"
                  onClick={() =>
                    setOpenCollectionId(
                      openCollectionId === collection.id
                        ? null
                        : collection.id
                    )
                  }
                >
                  {openCollectionId === collection.id
                    ? "Hide"
                    : "Add Movie"}
                </button>
              </div>

              {openCollectionId === collection.id && (
                <div className="collection-search">
                  <input
                    className="collections-input"
                    type="text"
                    placeholder="Search movie"
                    value={search}
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      setSearch(value);
                      searchMovies(value);
                    }}
                  />

                  {searchResults.length > 0 && (
                    <div className="collection-search-results">
                      {searchResults.map((movie) => (
                        <button
                          key={movie.imdbID}
                          type="button"
                          onClick={() => {
                            setMovieId(movie.imdbID);
                            setMovieTitle(movie.Title);
                            setSearch(movie.Title);
                            setSearchResults([]);
                          }}
                        >
                          {movie.Title}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    className="success-action"
                    onClick={() =>
                      addMovie(collection.id)
                    }
                  >
                    Add Movie
                  </button>
                </div>
              )}

              <div className="collection-movies">
                <h3>Movies</h3>

                {movies[collection.id]?.length ? (
                  movies[collection.id].map((movie) => (
                    <div
                      key={movie.id}
                      className="collection-movie"
                    >
                      <span>{movie.title}</span>

                      <button
                        className="ghost-action"
                        onClick={() =>
                          removeMovie(
                            collection.id,
                            movie.movie_id
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="collection-empty">
                    No movies in this collection yet.
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="collections-panel glass-panel">
          <h2>Discover Collections</h2>

          {discoverCollections.length === 0 ? (

            <p className="collection-empty">
              No public collections from other users yet.
            </p>

          ) : (

            <div className="discover-list">
              {discoverCollections.map((collection) => (
                <article
                  key={collection.id}
                  className="discover-card"
                >
                  <div>
                    <h3>
                      {collection.name}
                    </h3>

                    <p>
                      {collection.description ||
                        "No description added yet."}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="success-action"
                    onClick={() =>
                      followCollection(collection.id)
                    }
                  >
                    Follow
                  </button>
                </article>
              ))}
            </div>

          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Collections;
