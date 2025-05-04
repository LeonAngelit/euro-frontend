import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals.js";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout.jsx";
import { AppContextProvider } from "./Storage/AppContext.jsx";
import { Buffer } from 'buffer';
import { GoogleOAuthProvider } from '@react-oauth/google';
import config from "./config/config.js";
window.Buffer = window.Buffer || Buffer;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={config.clientID}>
    <AppContextProvider>
      <BrowserRouter>
        <Layout>
          <App />
        </Layout>
      </BrowserRouter>
    </AppContextProvider>
  </GoogleOAuthProvider>

);

reportWebVitals();
