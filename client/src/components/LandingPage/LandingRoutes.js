import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import RegisterPage from "./RegisterPage";
import Onboard from "./Onboard";
import ResetPasswordForm from "../Forms/resetPassword";

const LandingRoutes = () => {
  return (
    <BrowserRouter>
      {(() => {
        switch (window.location.pathname) {
          case "/login":
            return <Route path="/login" component={LoginPage} />;
          case "/resetPassword":
            return <Route path="/resetPassword" component={ResetPasswordForm} />;
          case "/register":
            return <Route exact path="/register" component={RegisterPage} />;
          case "/register/onboard":
            return <Route exact path="/register/onboard" component={Onboard} />;
          default:
            return <Route exact path="/" component={LandingPage} />;
        }
      })()}
    </BrowserRouter>
  );
};

export default LandingRoutes;