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

function StatsCards({
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
    {
      label: "Collections Created",
      value: stats.collections_count,
    },
    {
      label: "Searches Made",
      value: stats.total_searches,
    },
  ];

  return (
    <section className="dashboard-stats-grid">
      {cards.map((card) => (
        <article
          key={card.label}
          className="dashboard-stat-card glass-panel"
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

export default StatsCards;
