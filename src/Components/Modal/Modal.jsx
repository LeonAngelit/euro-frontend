import React from "react";
import PropTypes from "prop-types";

import "./Modal.component.css";

const Modal = (props) => {
  return (
    <div className="modal-container">
      <div
        className={
          props.status == "success"
            ? "modal success-modal"
            : props.status == "error"
            ? "modal error-modal"
            : "modal"
        }
      >
        <button
          className="modal-button"
          onClick={props.onclick && props.onclick}
        >
          <p>X</p>
        </button>
        <p>{props.message}</p>
        {props.confirm && (
          <div className="modal-action-buttons">
            <button
              className="action-btn"
              onClick={props.onaccept && props.onaccept}
            >
              Aceptar
            </button>
            <button
              className="action-delete-btn"
              onClick={props.onclick && props.onclick}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  props: PropTypes.object,
  onclick: PropTypes.func,
  onaccept: PropTypes.func,
  status: PropTypes.string,
  message: PropTypes.string,
  confirm: PropTypes.bool,
};

export default Modal;
