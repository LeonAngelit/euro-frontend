import { React, useContext, useState } from "react";
import "./RoomPicker.Component.css";
import AppContext from "../../Storage/AppContext";
import { VscChevronRight } from "react-icons/vsc";
import { IconContext } from "react-icons";
import axios from "axios";
import updateUserData from "../../utils/useUpdateUserData";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import Modal from "../../Components/Modal/Modal";

const RoomPicker = (props) => {
  const context = useContext(AppContext);
  const [modal, setModal] = useState({});
  const navigate = useNavigate();
  function selectRoom(event) {
    context.setCurrentRoom(
      context.user_logged.rooms.find(
        (element) => element.id == event.currentTarget.id
      )
    );
  }

  async function forgetRoom(event) {
    const data = {
      userId: parseInt(context.user_logged.id),
      roomId: parseInt(event.currentTarget.id),
    };
    axios
      .post(
        `${process.env.REACT_APP_BASEURL}/api/eurocontest/rooms/remove-user`,
        data,
        {
          headers: {
            Accept: "application/json",
            Bearer: context.x_token,
          },
        }
      )
      .then((response) => {
        if (response.status == 204) {
          updateUserData(context, navigate);
        }
      })
      .catch((error) => {
        return error.response.data.message;
      });
  }

  async function deleteRoom(id) {
    axios
      .delete(`${process.env.REACT_APP_BASEURL}/api/eurocontest/rooms/${id}`, {
        headers: {
          Accept: "application/json",
          Bearer: context.x_token,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          updateUserData(context, navigate);
        }
      })
      .catch((error) => {
        return error.response.data.message;
      });
  }

  return (
    <>
      {props.rooms != 0 ? (
        props.rooms.map((room) => {
          return (
            <div className="room-card" key={props.rooms.indexOf(room)}>
              <article className="room-container">
                <p>{room.name}</p>
                <button
                  id={room.id}
                  onClick={selectRoom}
                  className="room-icon-container"
                >
                  <IconContext.Provider
                    value={{ color: "black", size: "20px" }}
                  >
                    <VscChevronRight />
                  </IconContext.Provider>
                </button>
              </article>
              <div className="room-actions">
                <button id={room.id} onClick={forgetRoom}>
                  Olvidar
                </button>
                {room.adminId == context.user_logged.id && (
                  <button
                    id={room.id}
                    onClick={(event) => {
                      let element = event.currentTarget;
                      setModal({
                        visible: true,
                        message:
                          "¿Deseas eliminar la sala? Esta acción es irreversible",
                        confirm: true,
                        onaccept: () => {
                          deleteRoom(element.id);
                          setModal({});
                        },
                        onclick: () => setModal({}),
                      });
                    }}
                    className="delete-button"
                  >
                    <IconContext.Provider
                      value={{ color: "white", size: "20px" }}
                    >
                      <div className="header-icon-container">
                        <MdDeleteForever />
                        <p>Eliminar</p>
                      </div>
                    </IconContext.Provider>
                  </button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>Actualmente no te has registrado en ninguna sala.</p>
      )}
      {modal.visible && (
        <Modal
          onclick={modal.onclick}
          message={modal.message}
          confirm={modal.confirm}
          onaccept={modal.onaccept}
        />
      )}
    </>
  );
};

export default RoomPicker;
