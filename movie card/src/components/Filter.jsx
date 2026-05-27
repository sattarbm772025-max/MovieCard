import "./Filter.css";

function Filter({
  genre,
  setGenre,
}) {
  return (
    <select
      className="filter"
      value={genre}
      onChange={(e) =>
        setGenre(e.target.value)
      }
    >
      <option value="All">
        All Genres
      </option>

      <option value="Action">
        Action
      </option>

      <option value="Comedy">
        Comedy
      </option>

      <option value="Drama">
        Drama
      </option>

      <option value="Thriller">
        Thriller
      </option>
    </select>
  );
}

export default Filter;