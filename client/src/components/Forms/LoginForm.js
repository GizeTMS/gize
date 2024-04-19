import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import apiServer from "../../config/apiServer";

const LoginForm = ({ onToggleForm }) => {
  const { register, handleSubmit, errors } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  
  
  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { Email, Password, FirstName, LastName } = data;
  
    try {
      let response;
      if (isSignUpMode) {
        // Handle sign-up form submission
        response = await axios.post("http://localhost:3000/user", {
          FirstName: FirstName,
          LastName: LastName,
          Email: Email,
          Password: Password,
        });
        // Perform any necessary actions after successful sign-up
        console.log("Sign-up successful:", response.data);
      } else {
        // Handle login form submission
        response = await apiServer.post("http://localhost:3000/user/login", {
          Email: Email,
          Password: Password,
        });
  
        localStorage.setItem("Email", response.data.Email);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("token", response.data.token);
        setAuth(response.data.token);
  
        console.log("Authentication successful:", response.data);
      }
  
      setLoading(false);
  
      // Redirect to sign-in form after successful sign-up
      if (isSignUpMode) {
        setIsSignUpMode(false);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setErrorMessage("Authentication failed");
      setLoading(false);
    }
  };
  
 
  return (
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                name="Email"
                type="Email"
                placeholder="Email"
                ref={register({ required: true })}
              />
            </div>
            {errors.Email?.type === "required" && (
              <p style={{ color: "red", margin: "1px" }}>
                Please enter an Email address
              </p>
            )}
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                name="Password"
                type="Password"
                placeholder="Password"
                ref={register({ required: true })}
              />
            </div>
            {errors.Password?.type === "required" && (
              <p style={{ color: "red", margin: "1px" }}>
                Please enter a Password
              </p>
            )}
            <input
              type="submit"
              value={loading ? "Logging in.." : "Login"}
              className="btn solid"
            />
            <p className="forget-password" onClick={handleSignInClick}>
              <a href="/resetPassword"> Forgot your password? </a>
            </p>
            <p className="social-text"></p>
            <div className="social-media">
              <a href="#" className="socialIcon">
                <i className="fab fa-google"></i>
                <span className="social-text">Sign in with Google</span>
              </a>
            </div>
          </form>
          <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                name="FirstName"
                type="text"
                placeholder="First Name"
                ref={register({ required: true })}
              />
            </div>
            {errors.firstName?.type === "required" && (
              <p style={{ color: "red", margin: "1px" }}>
                Please enter your first name
              </p>
            )}
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                name="LastName"
                type="text"
                placeholder="Last Name"
                ref={register({ required: true })}
              />
            </div>
            {errors.lastName?.type === "required" && (
              <p style={{ color: "red", margin: "1px" }}>
                Please enter your last name
              </p>
            )}
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                name="Email"
                type="email"
                placeholder="Email"
                ref={register({ required: true })}
              />
            </div>
            {errors.email?.type === "required" && (
             <p style={{ color: "red", margin: "1px" }}>
                Please enter an Email address
              </p>
            )}
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                name="Password"
                type="password"
                placeholder="Password"
                ref={register({ required: true })}
              />
            </div>
            {errors.password?.type === "required" && (
              <p style={{ color: "red", margin: "1px" }}>
                Please enter a Password
              </p>
            )}
            <input
              type="submit"
              value={loading ? "Signing up.." : "Sign up"}
              className="btn solid"
            />
            <p className="social-text"></p>
            <div className="social-media">
              <a href="#" className="socialIcon">
                <i className="fab fa-google"></i>
                <span className="social-text">Sign up with Google</span>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Join us and discover amazing recipes and cooking tips!
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </div>
          <img
            src="img/log.svg"
            className="image"
            alt="Login or Sign Up"
          />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>
              Sign in to explore our collection of recipes and more!
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </div>
          <img
            src="../../assets/logo2.png"
            className="image"
            alt="Login or Sign Up"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;


