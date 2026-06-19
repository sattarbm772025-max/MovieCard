import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Collections() {

  const [collections, setCollections] = useState([]);
  const [movies, setMovies] = useState({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [movieId, setMovieId] = useState("");
  const [movieTitle, setMovieTitle] = useState("");

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [openCollectionId, setOpenCollectionId] = useState(null);

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

  const HoverButton = ({ style, children, ...props }) => {
    const [hover, setHover] = useState(false);

    return (
      <button
        {...props}
        style={{
          ...style,
          transform: hover ? "scale(1.05)" : "scale(1)",
          boxShadow: hover ? "0 6px 18px rgba(0,0,0,0.25)" : "none",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </button>
    );
  };

  const loadCollections = async () => {
    const res = await fetch("http://127.0.0.1:8000/collections");
    const data = await res.json();

    setCollections(data);

    data.forEach(async (collection) => {
      const movieRes = await fetch(
        `http://127.0.0.1:8000/collections/${collection.id}/movies`
      );
      const movieData = await movieRes.json();

      setMovies(prev => ({
        ...prev,
        [collection.id]: movieData
      }));
    });
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const createCollection = async () => {
    if (!name.trim()) {
      alert("Enter collection name");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description })
    });

    if (!response.ok) {
      alert("Failed to create collection");
      return;
    }

    setName("");
    setDescription("");
    loadCollections();
  };

  const deleteCollection = async (id) => {
    const response = await fetch(
      `http://127.0.0.1:8000/collections/${id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      alert("Delete failed");
      return;
    }

    loadCollections();
  };

  const addMovie = async (collectionId) => {
    if (!movieId) {
      alert("Select a movie");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/collections/${collectionId}/movies`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: movieId,
          title: movieTitle,
          poster: "",
          genre: ""
        })
      }
    );

    if (!response.ok) {
      alert("Failed to add movie");
      return;
    }

    setMovieId("");
    setMovieTitle("");
    setSearch("");
    setSearchResults([]);
    loadCollections();
  };

  const removeMovie = async (collectionId, movieId) => {
    const response = await fetch(
      `http://127.0.0.1:8000/collections/${collectionId}/movies/${movieId}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      alert("Delete movie failed");
      return;
    }

    loadCollections();
  };

  const searchMovies = async (title) => {
    if (!title) {
      setSearchResults([]);
      return;
    }

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=adecc7be&s=${title}`
    );

    const data = await response.json();

    setSearchResults(data.Search || []);
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>

        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          🎬 Movie Collections
        </h1>

        {/* CREATE COLLECTION */}
        <div style={{
          background: "#1e293b",
          padding: "14px",
          borderRadius: "12px",
          marginBottom: "20px"
        }}>
          <input
            type="text"
            placeholder="Collection Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "98%", padding: "10px", marginBottom: "10px" }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "98%", padding: "10px", marginBottom: "10px" }}
          />

          <HoverButton style={primaryBtn} onClick={createCollection}>
            ➕ Create Collection
          </HoverButton>
        </div>

        {/* COLLECTIONS */}
        {collections.map((collection) => (
          <div
            key={collection.id}
            style={{
              background: "linear-gradient(145deg, #1e293b, #0f172a)",
              padding: "14px",
              borderRadius: "12px",
              marginBottom: "16px",
              border: "1px solid #334155",
            }}
          >
            <h2 style={{ marginBottom: "4px" }}>{collection.name}</h2>

            <p style={{ opacity: 0.7, fontSize: "13px" }}>
              {collection.description?.length > 80
                ? collection.description.slice(0, 80) + "..."
                : collection.description}
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <HoverButton
                style={dangerBtn}
                onClick={() => deleteCollection(collection.id)}
              >
                🗑 Delete
              </HoverButton>

              <HoverButton
                style={ghostBtn}
                onClick={() =>
                  setOpenCollectionId(
                    openCollectionId === collection.id ? null : collection.id
                  )
                }
              >
                {openCollectionId === collection.id ? "Hide" : "➕ Add Movie"}
              </HoverButton>
            </div>

            {/* ADD MOVIE SECTION */}
            {openCollectionId === collection.id && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  placeholder="Search Movie"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    searchMovies(e.target.value);
                  }}
                  style={{ width: "98%", padding: "10px", marginBottom: "10px" }}
                />

                <div style={{
                  background: "white",
                  color: "black",
                  borderRadius: "8px",
                  maxHeight: "150px",
                  overflowY: "auto"
                }}>
                  {searchResults.map((movie) => (
                    <div
                      key={movie.imdbID}
                      style={{ padding: "8px", cursor: "pointer" }}
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
                  <HoverButton
                    style={successBtn}
                    onClick={() => addMovie(collection.id)}
                  >
                    🎬 Add Movie
                  </HoverButton>
                </div>
              </div>
            )}

            {/* MOVIES */}
            <div style={{ marginTop: "12px" }}>
              <h4>Movies</h4>

              {movies[collection.id]?.map((movie) => (
                <div
                  key={movie.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    marginBottom: "6px"
                  }}
                >
                  <span>🎥 {movie.title}</span>

                  <HoverButton
                    style={ghostBtn}
                    onClick={() =>
                      removeMovie(collection.id, movie.movie_id)
                    }
                  >
                    Remove
                  </HoverButton>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collections;