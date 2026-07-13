import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/Notifications.css";

function Notifications() {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchNotifications =
    useCallback(async () => {

      try {

        const response =
          await API.get("/notifications");

        setNotifications(response.data);

      } catch (error) {

        toast.error(
          error.response?.data?.detail ||
          "Failed to load notifications"
        );

      } finally {

        setLoading(false);
      }
    }, []);

  useEffect(() => {

    fetchNotifications();

  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {

    try {

      await API.put(
        `/notifications/${notificationId}/read`
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                is_read: true,
              }
            : item
        )
      );

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to mark notification as read"
      );
    }
  };

  return (
    <div className="notifications-page page-shell">
      <Navbar />

      <main className="notifications-inner">
        <header className="notifications-header">
          <div>
            <h1 className="page-title">
              Alerts
            </h1>

            <p className="page-subtitle">
              Review likes, collection follows, and new recommendations appear here.
            </p>
          </div>
        </header>

        {loading ? (

          <div className="notification-empty glass-panel">
            Loading alerts...
          </div>

        ) : notifications.length === 0 ? (

          <div className="notification-empty glass-panel">
            <h2>No alerts yet</h2>
            <p>Your activity updates will show here.</p>
          </div>

        ) : (

          <div className="notification-list">
            {notifications.map((item) => (
              <article
                key={item.id}
                className={`notification-card glass-panel ${
                  item.is_read ? "" : "unread"
                }`}
              >
                <div className="notification-dot" />

                <div className="notification-copy">
                  <h2>
                    {item.message}
                  </h2>

                  <p>
                    {item.type}
                  </p>
                </div>

                {!item.is_read && (
                  <button
                    type="button"
                    className="primary-action"
                    onClick={() =>
                      markAsRead(item.id)
                    }
                  >
                    Mark read
                  </button>
                )}
              </article>
            ))}
          </div>

        )}
      </main>

      <Footer />
    </div>
  );
}

export default Notifications;
