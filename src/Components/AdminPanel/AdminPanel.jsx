import { React } from "react";
import Form from "../Form/Form";
import "./AdminPanel.component.css";

const AdminPanel = (props) => {
  return (
    <>
      <div className="background"></div>
      <div className="admin-panel">
        <button className="close-panel-button" onClick={props.close}>
          X
        </button>
        <Form
          action={props.action}
          error={props.error}
          submitValue="Entrar"
          showPassword={true}
          fields={[
            {
              name: "password",
              placeholder: "Contraseña",
              id: "passwordField",
              type: "password",
              ref: props.refer,
            },
          ]}
        />
      </div>
    </>
  );
};

export default AdminPanel;
