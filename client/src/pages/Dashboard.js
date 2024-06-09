import React, { useState, useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { LoginContext } from "../components/Context";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { SetUser } from "../redux/usersSlice";
import Home from "./Home";
import Profile from "./Profile";
import Admin from "./Admin/index";
import { Badge, Avatar, message } from "antd";
import SellCreditsInfo from "./SellCreditsInfo/index.js";
import Notifications from "../components/Notifications.js";
import backgroundImage from "../images/wallpaper.gif";
import io from "socket.io-client";

const Dashboard = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const socket = io("http://localhost:8009", { transports: ["websocket", "polling", "flashsocket"] });

  const DashboardValid = async () => {
    dispatch(SetLoader(true));
    let token = localStorage.getItem("usersdatatoken");

    try {
      const res = await fetch("/validuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await res.json();
      dispatch(SetLoader(false));
      if (res.ok) {
        setLoginData(data);
        dispatch(SetUser(data)); 
        navigate("/home");
        getNotifications();
      } else {
        throw new Error(data.message || 'Failed to authenticate');
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message || 'Failed to authenticate');
      navigate("/login");
    }
  };

  const getNotifications = async () => {
    let token = localStorage.getItem("usersdatatoken");

    try {
      const resnotify = await fetch("/get-all-notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (resnotify.ok) {
        const responseData = await resnotify.json();
        setNotifications(responseData.data);
      } else {
        throw new Error(resnotify.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      message.error(error.message || 'Failed to fetch notifications');
    }
  };

  const readNotifications = async () => {
    let token = localStorage.getItem("usersdatatoken");

    try {
      const response = await fetch("/read-all-notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        getNotifications();
      } else {
        throw new Error(response.message || 'Failed to mark notifications as read');
      }
    } catch (error) {
      message.error(error.message || 'Failed to mark notifications as read');
    }
  };

  const logoutuser = async () => {
    dispatch(SetLoader(true));
    let token = localStorage.getItem("usersdatatoken");

    try {
      const res = await fetch("/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          Accept: "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      dispatch(SetLoader(false));
      if (res.ok) {
        localStorage.removeItem("usersdatatoken");
        setLoginData(false);
        message.success("Logged out Successfully");
        navigate("/login");
      } else {
        throw new Error(data.message || 'Failed to log out');
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message || 'Failed to log out');
      navigate("*");
    }
  };

  useEffect(() => {
    DashboardValid();
    socket.on("newNotification", (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
    }}
    >
      <div className="bg-black bg-opacity-50 p-5 flex justify-between items-center">
        <h1
          className="text-2xl text-white cursor-pointer"
          onClick={() => navigate("/home")}
        >
          CARBON CREDIT MARKET PLACE
        </h1>
        <div className="bg-white bg-opacity-50 py-2 px-5 rounded flex items-center gap-1">
          <span
            className="underline cursor-pointer"
            onClick={() => {
              if (user?.ValidUserOne?.role === "user") {
                navigate("/profile");
              } else {
                navigate("/admin");
              }
            }}
          >
            {logindata ? logindata.ValidUserOne.fname.toUpperCase() : ""}
          </span>
          <Badge
            count={notifications?.filter((notification) => !notification.read).length}
            onClick={() => {
              setShowNotifications(true);
              readNotifications(true);
            }}
            className="cursor-pointer"
          >
            <Avatar
              shape="circle"
              size="medium"
              icon={<i className="ri-notification-3-line"></i>}
            />
          </Badge>
          <i
            className="ri-logout-box-r-line ml-2 cursor-pointer"
            onClick={() => logoutuser()}
          ></i>
        </div>
        {
          <Notifications
            notifications={notifications}
            reloadNotifications={getNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
        }
      </div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/sell-credit/:id" element={<SellCreditsInfo />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );

};

export default Dashboard;
