import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import API from "../api/axios";
import Navbar from "../components/Navbar";

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.2s ease",
};

const primaryBtn = {
  ...buttonStyle,
  background: "#3b82f6",
  color: "white",
};

const dangerBtn = {
  ...buttonStyle,
  background: "#ef4444",
  color: "white",
};

const successBtn = {
  ...buttonStyle,
  background: "#22c55e",
  color: "white",
};

const ghostBtn = {
  ...buttonStyle,
  background: "transparent",
  color: "white",
  border: "1px solid #475569",
};

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
  };

  useEffect(() => {

    loadCollections();

  }, []);

  const createCollection = async () => {

    if (!name.trim()) {
      alert("Enter collection name");
      return;
    }

    await API.post(
      "/collections",
      {
        name,
        description,
      }
    );

    setName("");
    setDescription("");
    loadCollections();
  };

  const deleteCollection = async (id) => {

    await API.delete(
      `/collections/${id}`
    );

    loadCollections();
  };

  const addMovie = async (collectionId) => {

    if (!movieId) {
      alert("Select a movie");
      return;
    }

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
    loadCollections();
  };

  const removeMovie = async (
    collectionId,
    selectedMovieId
  ) => {

    await API.delete(
      `/collections/${collectionId}/movies/${selectedMovieId}`
    );

    loadCollections();
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

    const response =
      await API.get(
        `/movies/search?title=${encodeURIComponent(title)}`
      );

    setSearchResults(
      response.data.Search || []
    );
  };

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "20px",
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Movie Collections
        </h1>

        <div
          style={{
            background: "#1e293b",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Collection Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            style={{
              width: "98%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            style={{
              width: "98%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <button
            style={primaryBtn}
            onClick={createCollection}
          >
            Create Collection
          </button>
        </div>

        {collections.map((collection) => (
          <div
            key={collection.id}
            style={{
              background: "#1e293b",
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "16px",
              border: "1px solid #334155",
            }}
          >
            <h2 style={{ marginBottom: "4px" }}>
              {collection.name}
            </h2>

            <p
              style={{
                opacity: 0.7,
                fontSize: "13px",
              }}
            >
              {collection.description}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                style={dangerBtn}
                onClick={() =>
                  deleteCollection(collection.id)
                }
              >
                Delete
              </button>

              <button
                style={ghostBtn}
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
              <div style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  placeholder="Search Movie"
                  value={search}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setSearch(value);
                    searchMovies(value);
                  }}
                  style={{
                    width: "98%",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                />

                <div
                  style={{
                    background: "white",
                    color: "black",
                    borderRadius: "8px",
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {searchResults.map((movie) => (
                    <div
                      key={movie.imdbID}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setMovieId(movie.imdbID);
                        setMovieTitle(movie.Title);
                        setSearch(movie.Title);
                        setSearchResults([]);
                      }}
                    >
                      {movie.Title}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "10px" }}>
                  <button
                    style={successBtn}
                    onClick={() =>
                      addMovie(collection.id)
                    }
                  >
                    Add Movie
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: "12px" }}>
              <h4>Movies</h4>

              {movies[collection.id]?.map((movie) => (
                <div
                  key={movie.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    marginBottom: "6px",
                  }}
                >
                  <span>{movie.title}</span>

                  <button
                    style={ghostBtn}
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
              ))}
            </div>
          </div>
        ))}

        <div
          style={{
            background: "#1e293b",
            padding: "14px",
            borderRadius: "8px",
            marginTop: "24px",
            border: "1px solid #334155",
          }}
        >
          <h2>
            Discover Collections
          </h2>

          {discoverCollections.length === 0 ? (

            <p
              style={{
                opacity: 0.75,
              }}
            >
              No public collections from other users yet.
            </p>

          ) : (

            discoverCollections.map((collection) => (
              <div
                key={collection.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  borderTop: "1px solid #334155",
                  paddingTop: "12px",
                  marginTop: "12px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 4px",
                    }}
                  >
                    {collection.name}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      opacity: 0.7,
                    }}
                  >
                    {collection.description}
                  </p>
                </div>

                <button
                  type="button"
                  style={successBtn}
                  onClick={() =>
                    followCollection(collection.id)
                  }
                >
                  Follow
                </button>
              </div>
            ))

          )}
        </div>
      </div>
    </div>
  );
}

export default Collections;
