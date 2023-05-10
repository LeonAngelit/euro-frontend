import React, { useContext, useState, useEffect, useRef } from "react";
import "./UserDetails.Component.css";
import AppContext from "../../Storage/AppContext";
import { useNavigate } from "react-router-dom";
import CountryPicker from "../../Components/CountryPicker/CountryPicker";
import Collapsible from "../../Components/Collapsible/Collapsible";
import Modal from "../../Components/Modal/Modal";
import useValidateToken from "../../utils/useValidateToken";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import Form from "../../Components/Form/Form";
import axios from "axios";
import { validateRegex } from "../../utils/regexUtils";
import bcrypt from "bcrypt-nodejs";
window.Buffer = window.Buffer || require("buffer").Buffer;

const UserDetails = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [modal, setModal] = useState({});
  const [error, setError] = useState({});

  useEffect(() => {
    if (!context.user_logged) {
      navigate("/login");
      setError({});
    }
  }, []);
  useEffect(() => {
    if (!useValidateToken(context.user_logged?.token)) {
      useHandleCloseSession(context);
    }
  }, []);
  const passRef = useRef(null);
  const pass2Ref = useRef(null);
  const colorRef = useRef(null);
  let data;

  function updateUserData(event) {
    event.preventDefault();
    let input = event.target.children[0].children[1];
    if (input.type == "password" || input.type == "text") {
      if (passRef.current.value != pass2Ref.current.value) {
        setError({ status: true, message: "Las contraseñas no coinciden" });
        return false;
      } else {
        setError({});
      }
      if (
        !validateRegex(pass2Ref.current.value, () =>
          setError({
            status: true,
            message:
              "Contraseña no válida, debe contener al menos 8 caracteres, incluyendo números y mayúscula",
          })
        )
      ) {
        return false;
      } else {
        setError({});
      }
      const salt = bcrypt.genSaltSync(12);
      const pass = bcrypt.hashSync(passRef.current.value, salt, null);
      data = {
        password: pass,
      };
    } else if (input.type == "color") {
      data = {
        color: colorRef.current.value,
      };
    }

    axios
      .put(
        `${process.env.REACT_APP_BASEURL}/api/eurocontest/users/${context.user_logged.id}`,
        data,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${context.x_token}`,
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          setModal({
            visible: true,
            message: "Actualización correcta",
            status: "success",
            confirm: setModal({}),
          });
          setTimeout(() => {
            setModal({});
          }, 5000);
        }
      })
      .catch((error) => {
        setModal({
          visible: true,
          message: error.response.data.message,
          status: "error",
          confirm: setModal({}),
        });
        setTimeout(() => {
          setModal({});
        }, 5000);
      })
      .then(() => {
        event.target.reset();
      });
  }

  return (
    <div className="container">
      <Collapsible title={"Cambiar contraseña: "}>
        <Form
          action={updateUserData}
          error={error}
          showPassword={true}
          submitValue="Enviar"
          fields={[
            {
              name: "passwordOne",
              placeholder: "Contraseña",
              id: "passwordOne",
              type: "password",
              ref: passRef,
            },
            {
              name: "passwordTwo",
              placeholder: "Repetir contraseña",
              id: "passwordTwo",
              type: "password",
              ref: pass2Ref,
            },
          ]}
        />
      </Collapsible>

      <Collapsible title={"Cambiar color de tarjeta"}>
        <Form
          action={updateUserData}
          error={error}
          submitValue="Enviar"
          fields={[
            {
              name: "Color",
              placeholder: "Color",
              id: "colorField",
              type: "color",
              ref: colorRef,
            },
          ]}
        />
      </Collapsible>
      <Collapsible title={"Cambiar países seleccionados"}>
        <CountryPicker countries={context.songs} modal />
      </Collapsible>

      {modal.visible && !modal.confirm && (
        <Modal
          message={modal.message}
          status={modal.status}
          onclick={() => setModal({})}
        />
      )}
    </div>
  );
};

export default UserDetails;
