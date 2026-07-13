import {
  useEffect,
  useState,
} from "react";

function CountUp({
  value,
}) {

  const [count, setCount] =
    useState(0);

  useEffect(() => {

    const target = Number(value) || 0;

    if (target === 0) {
      setCount(0);
      return;
    }

    let frame = 0;
    const totalFrames = 24;
    const interval = window.setInterval(() => {
      frame += 1;
      setCount(
        Math.round(
          (target * frame) / totalFrames
        )
      );

      if (frame >= totalFrames) {
        window.clearInterval(interval);
      }
    }, 24);

    return () =>
      window.clearInterval(interval);

  }, [value]);

  return count;
}

function ProfileStats({
  stats,
}) {

  const cards = [
    {
      label: "Movies Watched",
      value: stats.watched_count,
    },
    {
      label: "Favorites",
      value: stats.favorites_count,
    },
    {
      label: "Watchlist Items",
      value: stats.watchlist_count,
    },
    {
      label: "Reviews Written",
      value: stats.reviews_count,
    },
  ];

  return (
    <section className="profile-stats-grid">
      {cards.map((card) => (
        <article
          key={card.label}
          className="profile-stat-card glass-panel"
        >
          <span>{card.label}</span>
          <strong>
            <CountUp value={card.value} />
          </strong>
        </article>
      ))}
    </section>
  );
}

export default ProfileStats;
