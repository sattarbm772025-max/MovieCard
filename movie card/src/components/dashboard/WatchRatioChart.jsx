import {
  Cell,
  Pie,
  PieChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#ffd60a",
  "#22c55e",
];

function WatchRatioChart({
  watched,
  watchlist,
}) {

  const data = [
    {
      name: "Watchlist",
      value: watchlist || 0,
    },
    {
      name: "Watched",
      value: watched || 0,
    },
  ];

  const hasData =
    data.some((item) => item.value > 0);

  return (
    <section className="dashboard-chart-card watch-ratio-card glass-panel">
      <h2>Watchlist vs Watched</h2>

      {!hasData ? (
        <p className="dashboard-empty-text">
          Add watchlist or watched movies to see this ratio.
        </p>
      ) : (
        <div className="watch-ratio-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius="72%"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={32}
            />
          </PieChart>
        </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default WatchRatioChart;
