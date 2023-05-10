import { React, useContext, useEffect } from "react";
import Footer from "./Components/Footer/Footer";
import Navigation from "./Components/Navigation/Navigation";
import PropTypes from "prop-types";
import axios from "axios";
import bcrypt from "bcrypt-nodejs";
import AppContext from "./Storage/AppContext";
window.Buffer = window.Buffer || require("buffer").Buffer;

function Layout({ children }) {
  const context = useContext(AppContext);

  async function sendTokenRequest() {
    const salt = bcrypt.genSaltSync(12);
    const token = bcrypt.hashSync(process.env.REACT_APP_AUTH_P, salt, null);
    await axios
      .get(`${process.env.REACT_APP_BASEURL}/api/eurocontest/getAuthToken`, {
        headers: {
          Accept: "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          context.setXtoken(response.data);
        }
      })
      .catch((error) => {
        return error.response.data.message;
      });
  }

  async function updatePointRequest() {
    await axios
      .get(
        `${process.env.REACT_APP_BASEURL}/api/eurocontest/countries/refresh/2023`,
        {
          headers: {
            Accept: "application/json",
            Bearer: context.x_token,
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          return response.data;
        }
      })
      .catch((error) => {
        return error.response.data.message;
      });
  }

  useEffect(() => {
    sendTokenRequest();
    setInterval(() => sendTokenRequest(), 1200000);
  }, []);

  useEffect(() => {
    let interval;
    if (
      context.x_token &&
      context.user_logged?.username == process.env.REACT_APP_ADMIN
    ) {
      interval = setInterval(() => {
        updatePointRequest();
      }, 90000);
    } else {
      clearInterval(interval);
    }
  }, [context.user_logged.username]);

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
