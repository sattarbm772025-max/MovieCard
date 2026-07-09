import {
  Cell,
  Pie,
  PieChart,
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
    <section className="dashboard-chart-card glass-panel">
      <h2>Watchlist vs Watched</h2>

      {!hasData ? (
        <p className="dashboard-empty-text">
          Add watchlist or watched movies to see this ratio.
        </p>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={280}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={95}
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
          </PieChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

export default WatchRatioChart;
