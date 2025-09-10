import React, { useEffect, useState } from "react";
import { Header } from "./header/Header";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

useEffect(() => {
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("Token yok!");

    try {
      const res = await fetch("http://localhost:5000/api/match/notifications", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchNotifications();
}, []);


  return (
    <>
      <Header />
      <div>
        <h2>Bildirimler</h2>
        {notifications.length === 0 ? (
          <p>Yeni bildirim yok</p>
        ) : (
          <ul>
            {notifications.map(n => (
              <li key={n.matchId}>
                {n.message} - Bloglar: {n.blogs.map(b => b.title).join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notification;
