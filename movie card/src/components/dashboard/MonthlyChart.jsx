import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MonthlyChart({
  data,
}) {

  return (
    <section className="dashboard-chart-card glass-panel">
      <h2>Watched Per Month</h2>

      {data.every((item) => item.count === 0) ? (
        <p className="dashboard-empty-text">
          No monthly watched activity yet.
        </p>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={280}
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{
                r: 5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

export default MonthlyChart;
