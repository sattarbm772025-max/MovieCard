import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatsCards from "../components/dashboard/StatsCards";
import GenreChart from "../components/dashboard/GenreChart";
import MonthlyChart from "../components/dashboard/MonthlyChart";
import WatchRatioChart from "../components/dashboard/WatchRatioChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import { useToast } from "../context/ToastContext";
import API from "../services/api";

import "../styles/Dashboard.css";

function Dashboard() {

  const { showToast } =
    useToast();

  const [stats, setStats] =
    useState({
      watched_count: 0,
      favorites_count: 0,
      watchlist_count: 0,
      reviews_count: 0,
      collections_count: 0,
      total_searches: 0,
      most_watched_genre: null,
      watched_this_month: 0,
      streak_count: 0,
    });

  const [genres, setGenres] =
    useState([]);

  const [monthly, setMonthly] =
    useState([]);

  const [activity, setActivity] =
    useState({
      recent_watched: [],
      recent_favorites: [],
      recent_reviews: [],
    });

  const [loading, setLoading] =
    useState(true);

  const loadDashboard = useCallback(async () => {

    try {

      setLoading(true);

      const [
        statsResponse,
        genresResponse,
        monthlyResponse,
        recentResponse,
      ] = await Promise.allSettled([
        API.get("/dashboard"),
        API.get("/dashboard/genres"),
        API.get("/dashboard/monthly"),
        API.get("/dashboard/recent"),
      ]);

      if (statsResponse.status === "fulfilled") {
        setStats(statsResponse.value.data);
      } else {
        showToast("Failed to load dashboard stats", "error");
      }

      if (genresResponse.status === "fulfilled") {
        setGenres(genresResponse.value.data);
      } else {
        showToast("Failed to load genre chart", "error");
      }

      if (monthlyResponse.status === "fulfilled") {
        setMonthly(monthlyResponse.value.data);
      } else {
        showToast("Failed to load monthly chart", "error");
      }

      if (recentResponse.status === "fulfilled") {
        setActivity(recentResponse.value.data);
      } else {
        showToast("Failed to load recent activity", "error");
      }

    } finally {

      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);

  const isEmpty = useMemo(
    () =>
      stats.watched_count === 0 &&
      stats.favorites_count === 0 &&
      stats.watchlist_count === 0 &&
      stats.reviews_count === 0 &&
      stats.collections_count === 0 &&
      stats.total_searches === 0,
    [stats]
  );

  if (loading) {

    return (
      <div className="dashboard-page page-shell">
        <Navbar />
        <main className="dashboard-inner">
          <div className="dashboard-loader glass-panel">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page page-shell">
      <Navbar />

      <main className="dashboard-inner">
        <header className="dashboard-header">
          <div>
            <h1 className="page-title">
              Dashboard
            </h1>
            <p className="page-subtitle">
              Your movie activity, charts, and recent updates in one place.
            </p>
          </div>

          <div className="dashboard-badges">
            {stats.most_watched_genre && (
              <span>
                Most watched: {stats.most_watched_genre}
              </span>
            )}
            <span>
              Streak: {stats.streak_count || 0} days
            </span>
          </div>
        </header>

        <section className="dashboard-message glass-panel">
          You watched {stats.watched_this_month || 0} movies this month.
          Keep building your movie journey.
        </section>

        <StatsCards stats={stats} />

        {isEmpty ? (
          <section className="dashboard-empty glass-panel">
            <h2>No activity yet</h2>
            <p>
              Search, save, watch, review, or collect movies to fill your dashboard.
            </p>
          </section>
        ) : (
          <>
            <section className="dashboard-charts">
              <GenreChart data={genres} />
              <MonthlyChart data={monthly} />
              <WatchRatioChart
                watched={stats.watched_count}
                watchlist={stats.watchlist_count}
              />
            </section>

            <RecentActivity activity={activity} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
