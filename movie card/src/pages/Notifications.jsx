import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import API from "../api/axios";
import Navbar from "../components/Navbar";

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
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >

      <Navbar />

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "24px",
        }}
      >

        <h1>
          Notifications
        </h1>

        {loading ? (

          <p>Loading...</p>

        ) : notifications.length === 0 ? (

          <p>No notifications yet.</p>

        ) : (

          notifications.map((item) => (

            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                background: item.is_read
                  ? "#1e293b"
                  : "#243b63",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "14px",
                marginTop: "12px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: item.is_read
                      ? "400"
                      : "700",
                  }}
                >
                  {item.message}
                </p>

                <small
                  style={{
                    color: "#cbd5e1",
                  }}
                >
                  {item.type}
                </small>
              </div>

              {!item.is_read && (
                <button
                  type="button"
                  onClick={() =>
                    markAsRead(item.id)
                  }
                  style={{
                    background: "#ffd60a",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Mark read
                </button>
              )}
            </div>

          ))

        )}

      </main>

    </div>
  );
}

export default Notifications;
