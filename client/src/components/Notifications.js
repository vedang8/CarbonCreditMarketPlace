import { message, Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";

function Notifications({
  notifications = [],
  reloadNotifications,
  showNotifications,
  setShowNotifications,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteNotification = async (id) => {
    try {
      dispatch(SetLoader(true));
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/delete-notification/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
  
      dispatch(SetLoader(false));
      if (response.ok) {
        const data = await response.json(); // Extract message from response body
        message.success(data.message); // Use data.message
        reloadNotifications();
      } else {
        const data = await response.json(); // Extract error message from response body
        throw new Error(data.message); // Throw error with error message
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message || "An error occurred"); // Use error.message if present, else provide a generic error message
    }
  };
  
  return (
    <Modal
      title="Notifications"
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      footer={null}
      centered
      width={1000}
    >
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            className="flex flex-col border border-solid p-2 border-gray-300 rounded cursor-pointer"
            key={notification._id}
          >
            <div className="flex justify-between items-center">
              <div
                onClick={() => {
                  navigate(notification.onClick);
                  setShowNotifications(false);
                }}
              >
                <h1 className="text-gray-700">{notification.title}</h1>
                <span className="text-gray-600">{notification.message}</span>
                <h1 className="text-gray-500 text-sm">
                  {moment(notification.createdAt).fromNow()}
                </h1>
              </div>
              <i
                className="ri-delete-bin-line"
                onClick={() => {
                  deleteNotification(notification._id);
                }}
              ></i>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default Notifications;
