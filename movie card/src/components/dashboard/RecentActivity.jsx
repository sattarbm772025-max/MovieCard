function ActivityImage({
  src,
  alt,
}) {

  return (
    <img
      src={
        src && src !== "N/A"
          ? src
          : "https://via.placeholder.com/80x110"
      }
      alt={alt}
    />
  );
}

function RecentActivity({
  activity,
}) {

  const hasActivity =
    activity.recent_watched.length > 0 ||
    activity.recent_favorites.length > 0 ||
    activity.recent_reviews.length > 0;

  return (
    <section className="dashboard-activity glass-panel">
      <h2>Recent Activity</h2>

      {!hasActivity ? (
        <p className="dashboard-empty-text">
          No activity yet. Start watching, saving, or reviewing movies.
        </p>
      ) : (
        <div className="activity-grid">
          <div>
            <h3>Recently Watched</h3>
            {activity.recent_watched.map((movie) => (
              <article
                key={`${movie.title}-${movie.watched_date}`}
                className="activity-card"
              >
                <ActivityImage
                  src={movie.poster}
                  alt={movie.title}
                />
                <div>
                  <strong>{movie.title}</strong>
                  <span>
                    {movie.watched_date
                      ? new Date(movie.watched_date)
                          .toLocaleDateString()
                      : "Watched recently"}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div>
            <h3>Recent Favorites</h3>
            {activity.recent_favorites.map((movie) => (
              <article
                key={movie.title}
                className="activity-card"
              >
                <ActivityImage
                  src={movie.poster}
                  alt={movie.title}
                />
                <div>
                  <strong>{movie.title}</strong>
                  <span>Added to favorites</span>
                </div>
              </article>
            ))}
          </div>

          <div>
            <h3>Recent Reviews</h3>
            {activity.recent_reviews.map((review) => (
              <article
                key={`${review.movie_title}-${review.rating}`}
                className="activity-card compact"
              >
                <div>
                  <strong>{review.movie_title}</strong>
                  <span>
                    Rating {review.rating}/5
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default RecentActivity;
