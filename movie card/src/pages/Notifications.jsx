import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {

    fetchNotifications();

  }, []);

  const fetchNotifications = async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        "https://moviecard-fr7a.onrender.com/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    setNotifications(response.data);
  };

  return (
    <div>

      <h2>
        Notifications
      </h2>

      {notifications.map((item) => (

        <div key={item.id}>
          {item.message}
        </div>

      ))}

    </div>
  );
}

export default Notifications;