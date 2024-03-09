import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { message } from "antd";
// import {ToastContainer, toast} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import imageSrc from '../images/carbontrading.jpg';
import "./mix.css";

const Register = () => {
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setcPassShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inpval, setInpval] = useState({
    fname: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const setVal = (e) => {
    //console.log(e.target.value);
    const { name, value } = e.target;
    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const addUserdata = async (e) => {
    e.preventDefault();

    const { fname, email, password, cpassword } = inpval;

    if (fname === "") {
      message.error("Username is required");
    } else if (email === "") {
      message.error("Email is required");
    } else if (!email.includes("@gmail.com")) {
      message.error("Please enter valid email");
    } else if (password === "") {
      message.error("Enter your Password");
    } else if (password.length < 6) {
      message.error("Password must be 6 char");
    } else if (cpassword === "") {
      message.error("Enter your confirm password");
    } else if (cpassword.length < 6) {
      message.error("Confirm Password must be 6 char");
    } else if (password !== cpassword) {
      message.error("Password and Confirm Password must be same");
    } else {
      dispatch(SetLoader(true));
      // console.log("user registration done");
      const data = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname,
          email,
          password,
          cpassword,
        }),
      });
      const res = await data.json();
      dispatch(SetLoader(false));
      //console.log(res);
      if (res.status === 201) {
        message.success("Congratulations!!! 🎉 You are registered");
        message.success("Please Login with your credentials");
        message.success("🪙 10 points are rewarded! 🎊");
        setInpval({
          ...inpval,
          fname: "",
          email: "",
          password: "",
          cpassword: "",
        });
        navigate("/login");
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
            <h1>Sign Up</h1>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="fname">Name</label>
              <input
                type="text"
                onChange={setVal}
                value={inpval.fname}
                name="fname"
                id="fname"
                placeholder="Enter Your Name"
              />
            </div>
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
            <div className="form_input">
              <label htmlFor="password">Confirm Password</label>
              <div className="two">
                <input
                  type={!cpassShow ? "password" : "text"}
                  onChange={setVal}
                  value={inpval.cpassword}
                  name="cpassword"
                  id="cpassword"
                  placeholder="Enter Your Confirm Password"
                />
                <div
                  className="showpass"
                  onClick={() => setcPassShow(!cpassShow)}
                >
                  {!cpassShow ? "Show" : "Hide"}
                </div>
              </div>
            </div>
            <button className="btn" onClick={addUserdata}>
              Sign Up
            </button>
            <p>
              Already have an Account? <NavLink to="/login">Login</NavLink>
            </p>
          </form>
        </div>
      </section>
      </div>
    </div>
      
    </>
  );
};

export default Register;
