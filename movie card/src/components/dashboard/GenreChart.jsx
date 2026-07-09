import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function GenreChart({
  data,
}) {

  return (
    <section className="dashboard-chart-card glass-panel">
      <h2>Top Watched Genres</h2>

      {data.length === 0 ? (
        <p className="dashboard-empty-text">
          No watched genre data yet.
        </p>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={280}
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="genre" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#ffd60a"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

export default GenreChart;
