import React, { useContext, useEffect } from "react";
import logo from "../../../public/logo.svg";
import "./App.css";
import { useNavigate } from "react-router-dom";
import AppContext from "../../Storage/AppContext";

const NotFound = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (context.token == undefined) {
      navigate("/login");
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
