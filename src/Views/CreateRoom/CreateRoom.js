import React, { useContext, useRef, useState, useEffect } from "react";
import "./CreateRoom.Component.css";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import useValidateToken from "../../utils/useValidateToken";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import updateUserData from "../../utils/useUpdateUserData";
import { useNavigate } from "react-router-dom";
import { validateRegex } from "../../utils/regexUtils";
import bcrypt from "bcrypt-nodejs";
import Form from "../../Components/Form/Form";

window.Buffer = window.Buffer || require("buffer").Buffer;

const CreateRoom = () => {
  const context = useContext(AppContext);
  const passwordRef = useRef(null);
  const passwordTwodRef = useRef(null);
  const roomNameRef = useRef(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!context.user_logged) {
      navigate("/login");
    }
    if (!useValidateToken(context.user_logged?.token)) {
      useHandleCloseSession(context);
    }
  }, []);
  useEffect(() => {
    useValidateToken(context.user_logged?.token);
  }, [context]);

  async function crearSala(event) {
    event.preventDefault();

    if (passwordRef.current.value != passwordTwodRef.current.value) {
      setError({ status: true, message: "Las contraseñas no coinciden" });
      return false;
    }
    if (
      !validateRegex(passwordRef.current.value, () =>
        setError({
          status: true,
          message:
            "Contraseña no válida, debe contener al menos 8 caracteres, incluyendo números y mayúscula",
        })
      )
    ) {
      return false;
    }
    const salt = bcrypt.genSaltSync(12);
    const pass = bcrypt.hashSync(passwordRef.current.value, salt, null);
    const data = {
      name: roomNameRef.current.value,
      password: pass,
      adminId: context.user_logged.id,
    };
    axios
      .post(`${process.env.REACT_APP_BASEURL}/api/eurocontest/rooms`, data, {
        headers: {
          Accept: "application/json",
          Bearer: context.x_token,
        },
      })
      .then((response) => {
        if (response.status == 201) {
          updateUserData(context, navigate);
        } else {
          setError({
            status: true,
            message: response.data.message,
          });
        }
      })
      .catch((error) => {
        if (error.response.status == 409) {
          setError({
            status: true,
            message: "Este nombre de sala ya está registrado",
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
    <div className="container">
      <Form
        action={crearSala}
        error={error}
        showPassword={true}
        submitValue="Crear Sala"
        fields={[
          {
            name: "username",
            placeholder: "Nombre de sala",
            type: "text",
            ref: roomNameRef,
          },
          {
            name: "password",
            placeholder: "Contraseña",
            type: "password",
            id: "passwordOne",
            ref: passwordRef,
          },
          {
            name: "password2",
            placeholder: "Repetir contraseña",
            id: "passwordTwo",
            type: "password",
            ref: passwordTwodRef,
          },
        ]}
      />
    </div>
  );
};

export default CreateRoom;
