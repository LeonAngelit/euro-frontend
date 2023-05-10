import React, { useContext, useEffect, useState, useRef } from "react";
import "./Home.Component.css";
import AppContext from "../../Storage/AppContext";
import { Link, useNavigate } from "react-router-dom";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import useValidateToken from "../../utils/useValidateToken";
import useGetSongs from "../../utils/useGetSongs";
import CountryPicker from "../../Components/CountryPicker/CountryPicker";
import bcrypt from "bcrypt-nodejs";
import axios from "axios";
import Form from "../../Components/Form/Form";
import RoomPicker from "../../Components/RoomPicker/RoomPicker";
import Classification from "../../Components/ClassificationView/Classification";
import updateUserData from "../../utils/useUpdateUserData";
import Collapsible from "../../Components/Collapsible/Collapsible";
window.Buffer = window.Buffer || require("buffer").Buffer;

const Home = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [songs, setSongs] = useState(false);
  const passwordRef = useRef(null);
  const roomNameRef = useRef(null);
  const [error, setError] = useState(false);
  async function initializeSongs() {
    const songs = await useGetSongs(context);
    setSongs(songs);
  }
  useEffect(() => {
    if (!context.user_logged?.token) {
      navigate("/login");
    }
  }, [context]);
  useEffect(() => {
    let interval = setInterval(() => {
      if (!useValidateToken(context.user_logged?.token)) {
        useHandleCloseSession(context);
        clearInterval(interval);
      }
    }, 3600000);
  }, []);
  useEffect(() => {
    if (context.x_token) {
      initializeSongs();
    }
  }, []);

  useEffect(() => {
    context.setSongs(songs);
  }, [songs]);

  async function joinRoom(event) {
    event.preventDefault();
    axios
      .get(
        `${process.env.REACT_APP_BASEURL}/api/eurocontest/rooms/name/${roomNameRef.current.value}`,
        {
          headers: {
            Accept: "application/json",
            Bearer: context.x_token,
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          if (
            bcrypt.compareSync(
              passwordRef.current.value,
              response.data.password
            )
          ) {
            addUserRoom({
              userId: context.user_logged.id,
              roomId: response.data.id,
            });
          } else {
            setError({
              status: true,
              message: "Contaseña incorrecta",
            });
          }
        }
        event.target.reset();
      })
      .catch((error) => {
        if (error.response.status == 404) {
          setError({
            status: true,
            message: "Sala no encontrada, prueba con otro ID",
          });
        } else {
          setError({
            status: true,
            message: error.response.data.message,
          });
        }
        event.target.reset();
      });
  }

  async function addUserRoom(data) {
    axios
      .post(
        `${process.env.REACT_APP_BASEURL}/api/eurocontest/rooms/add-user`,
        data,
        {
          headers: {
            Accept: "application/json",
            Bearer: context.x_token,
          },
        }
      )
      .then((response) => {
        if (response.status == 201) {
          updateUserData(context, navigate);
        }
      })
      .catch((error) => {
        if (error.response.status == 404) {
          setError({
            status: true,
            message: "Sala no encontrada, prueba con otro ID",
          });
        } else {
          setError({
            status: true,
            message: error.response.data.message,
          });
        }
      });
  }

  return (
    <>
      {(context.user_logged.countries?.length < 5 ||
        context.user_logged.countries == undefined) &&
        context.songs && (
          <div className="container container-blue">
            <CountryPicker countries={context.songs} modal />
          </div>
        )}
      {context.user_logged.countries?.length == 5 &&
        context.current_room == undefined && (
          <div className="container">
            <div className="rooms-options">
              <p>Selecciona una sala de tu lista:</p>
              <RoomPicker rooms={context.user_logged?.rooms} />
              <Collapsible title={"Unirte a una sala: "}>
                <Form
                  action={joinRoom}
                  error={error}
                  submitValue="Unirme"
                  showPassword={true}
                  fields={[
                    {
                      name: "roomname",
                      placeholder: "ID de la sala",
                      type: "text",
                      ref: roomNameRef,
                    },
                    {
                      name: "password",
                      placeholder: "Contraseña",
                      id: "passwordField",
                      type: "password",
                      ref: passwordRef,
                    },
                  ]}
                />
                <div className="subtitle">
                  <p>
                    Únete o <Link to={"/createroom"}>Crea una sala</Link>
                  </p>
                </div>
              </Collapsible>
            </div>
          </div>
        )}

      {context.user_logged.countries?.length == 5 &&
        context.current_room != undefined && (
          <div className="container">
            <Classification room={context.current_room} />
          </div>
        )}
    </>
  );
};

export default Home;
