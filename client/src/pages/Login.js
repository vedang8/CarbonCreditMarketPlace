import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./mix.css";
import { useDispatch } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { message } from "antd";
import imageSrc from '../images/carbontrading.jpg';

const Login = () => {
  const [passShow, setPassShow] = useState(false);

  const [inpval, setInpval] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const setVal = (e) => {
    const { name, value } = e.target;
    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const loginuser = async (e) => {
    e.preventDefault();
    const { email, password } = inpval;

    if (email === "") {
      message.error("Please enter your email");
    } else if (!email.includes("@gmail.com")) {
      message.error("Please enter a valid email");
    } else if (password === "") {
      message.error("Enter your password");
    } else if (password.length < 6) {
      message.error("Password must be at least 6 characters");
    } else {
      dispatch(SetLoader(true));
      try {
        const data = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const res = await data.json();
        dispatch(SetLoader(false));
        console.log(res);
        if (res.status === 201) {
          localStorage.setItem("usersdatatoken", res.result.token);
          message.success("Welcome to CARBON CREDIT MARKETPLACE");
          navigate("/home");
          setInpval({ ...inpval, email: "", password: "" });
        } else if (res.error === "User account is blocked") {
          message.error("Your account is blocked!!!");
        } else {
          message.error("Invalid Details");
        }
      } catch (error) {
        dispatch(SetLoader(false));
        message.error("An error occurred. Please try again later.");
        console.error("Login error:", error);
      }
    }
  };

  return (
    <>
    <div className="login-container">
      <div className="left-half">
        <img src={imageSrc} alt="Image" />
      </div>
      <div className="right-half">
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Welcome Back, Log In</h1>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                onChange={setVal}
                value={inpval.email}
                name="email"
                id="email"
                placeholder="Enter Your Email Address"
              />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className="two">
                <input
                  type={!passShow ? "password" : "text"}
                  onChange={setVal}
                  value={inpval.password}
                  name="password"
                  id="password"
                  placeholder="Enter Your Password"
                />
                <div
                  className="showpass"
                  onClick={() => setPassShow(!passShow)}
                >
                  {!passShow ? "Show" : "Hide"}
                </div>
              </div>
            </div>
            <button className="btn" onClick={loginuser}>
              Login
            </button>
            <p>
              Don't have an Account? <NavLink to="/register">Sign Up</NavLink>
            </p>
          </form>
        </div>
      </section>
      </div>
    </div>
    </>
  );
};

export default Login;
