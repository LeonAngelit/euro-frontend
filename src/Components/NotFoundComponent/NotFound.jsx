import React, { useEffect, useContext } from "react";
import logo from "./logo.svg";
import { useNavigate } from "react-router-dom";
import AppContext from "../../Storage/AppContext";
import "./App.css";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";

const NotFound = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  useEffect(() => {

    if (!context.user_logged?.token) {
      useNavigateWithCallback(navigate, "/login");
    } else {
      useNavigateWithCallback(navigate, "/app")
    }


  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} alt="logo" className="App-logo" />
        <h2>ERROR 404 - PÁGINA NO ENCONTRADA</h2>
      </div>
    </div>
  );
};

export default NotFound;
