const COMMON_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

function GenrePreferences({
  preferences,
  selectedGenre,
  onGenreChange,
  onAdd,
  onRemove,
}) {

  return (
    <section className="profile-panel glass-panel">
      <div className="profile-panel-header">
        <div>
          <h2>Genre Preferences</h2>
          <p>
            Choose genres that shape your movie recommendations.
          </p>
        </div>
      </div>

      <div className="genre-form">
        <select
          value={selectedGenre}
          onChange={(event) =>
            onGenreChange(event.target.value)
          }
        >
          <option value="">
            Select genre
          </option>

          {COMMON_GENRES.map((genre) => (
            <option
              key={genre}
              value={genre}
            >
              {genre}
            </option>
          ))}
        </select>

        <button
          className="primary-action"
          onClick={onAdd}
        >
          Add Genre
        </button>
      </div>

      {preferences.length === 0 ? (
        <p className="profile-empty">
          No preferred genres yet.
        </p>
      ) : (
        <div className="genre-chip-list">
          {preferences.map((preference) => (
            <span
              key={preference.id}
              className="genre-chip"
            >
              {preference.genre}
              <button
                type="button"
                onClick={() =>
                  onRemove(preference.id)
                }
                aria-label={`Remove ${preference.genre}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export default GenrePreferences;
