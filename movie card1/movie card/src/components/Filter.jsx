import "./Filter.css";

function Filter({ genre, setGenre }) {
  return (
    <select
      value={genre}
      onChange={(e) => setGenre(e.target.value)}
      className="filter"
    >
      <option value="All">All Genres</option>
      <option value="Action">Action</option>
      <option value="Romance">Romance</option>
      <option value="Thriller">Thriller</option>
    </select>
  );
}

export default Filter;