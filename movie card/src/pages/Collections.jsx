import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Collections() {

  const [collections, setCollections] = useState([]);
  const [movies, setMovies] = useState({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [movieId, setMovieId] = useState("");
  const [movieTitle, setMovieTitle] = useState("");

  const loadCollections = () => {

    fetch("http://127.0.0.1:8000/collections")
      .then((res) => res.json())
      .then((data) => {

        setCollections(data);

        data.forEach((collection) => {

          fetch(
            `http://127.0.0.1:8000/collections/${collection.id}/movies`
          )
            .then((res) => res.json())
            .then((movieData) => {

              setMovies((prev) => ({
                ...prev,
                [collection.id]: movieData
              }));

            });

        });

      });

  };

  useEffect(() => {

    loadCollections();

  }, []);

  const createCollection = async () => {

    await fetch(
      "http://127.0.0.1:8000/collections",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description
        })
      }
    );

    setName("");
    setDescription("");

    loadCollections();
  };

  const deleteCollection = async (id) => {

    await fetch(
      `http://127.0.0.1:8000/collections/${id}`,
      {
        method: "DELETE"
      }
    );

    loadCollections();
  };

  const addMovie = async (collectionId) => {

    await fetch(
      `http://127.0.0.1:8000/collections/${collectionId}/movies`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          movie_id: movieId,
          title: movieTitle,
          poster: "",
          genre: ""
        })
      }
    );

    setMovieId("");
    setMovieTitle("");

    loadCollections();
  };

  const removeMovie = async (
    collectionId,
    movieId
  ) => {

    await fetch(
      `http://127.0.0.1:8000/collections/${collectionId}/movies/${movieId}`,
      {
        method: "DELETE"
      }
    );

    loadCollections();
  };

  return (
    <div>

      <Navbar />

      <h1>Collections</h1>

      <input
        type="text"
        placeholder="Collection Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <br /><br />

      <button onClick={createCollection}>
        Create Collection
      </button>

      <hr />

      {collections.map((collection) => (

        <div
          key={collection.id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            margin: "15px"
          }}
        >

          <h2>{collection.name}</h2>

          <p>{collection.description}</p>

          <button
            onClick={() =>
              deleteCollection(collection.id)
            }
          >
            Delete Collection
          </button>

          <hr />

          <h3>Add Movie</h3>

          <input
            type="text"
            placeholder="Movie ID"
            value={movieId}
            onChange={(e) =>
              setMovieId(e.target.value)
            }
          />

          <br /><br />

          <input
            type="text"
            placeholder="Movie Title"
            value={movieTitle}
            onChange={(e) =>
              setMovieTitle(e.target.value)
            }
          />

          <br /><br />

          <button
            onClick={() =>
              addMovie(collection.id)
            }
          >
            Add Movie
          </button>

          <hr />

          <h3>Movies</h3>

          {movies[collection.id]?.map((movie) => (

            <div
              key={movie.id}
              style={{
                marginBottom: "10px"
              }}
            >

              {movie.title}

              <button
                style={{
                  marginLeft: "10px"
                }}
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

      ))}

    </div>
  );
}

export default Collections;