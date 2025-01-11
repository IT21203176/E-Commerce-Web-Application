import React, { useState, useEffect } from "react";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import { ChatIcon } from "../../utils/icons";
import TimeAgo from "timeago-react";
import axios from "axios";

const Notifications = () => {
  // Retrieve the user context to access user details
  const { user } = useStateContext();
  const receiverId = user.id;
  const userRole = user.role;

  // State to hold notifications and loading status
  const [notifications, setNotifications] = useState([]);
  const [notificationsTableLoading, setNotificationsTableLoading] =
    useState(false);
  const handleLoading = () => setNotificationsTableLoading((pre) => !pre);

  // Fetching notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let response;
        if (userRole === "1" || userRole === "2") {
          response = await axios.get(`http://localhost:1000/admin-csr/${userRole}`);
        } else if (userRole === "3") {
          response = await axiosClient.get(`Notifications/${receiverId}`);
        }
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    fetchNotifications();
  }, [notificationsTableLoading]);

  return (
    <section>
      <div className="container bg-white rounded-card p-4 ">
        <div>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="bg-light p-3 my-2 rounded-card ">
                <ChatIcon />
                <span className="modal-label theme-text-color ">
                  {" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;{notification.message}
                </span>
                <br />
                <small className="text-muted d-flex justify-content-end theme-text-color">
                  <TimeAgo datetime={notification.createdAt} />
                </small>
              </div>
            ))
          ) : (
            <p className="text-center theme-text-color">
              No notifications available
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Notifications;
