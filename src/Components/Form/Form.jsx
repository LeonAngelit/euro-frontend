import { React, useContext, useState } from "react";
import AppContext from "../../Storage/AppContext";
import "./Form.Component.css";

const Form = (props) => {
  const context = useContext(AppContext);

  function myFunction(event) {
    let input;
    let checkbox = event.target;
    for (let i = 0; i < props.fields.length; i++) {
      if (props.fields[i].id) {
        input = document.getElementById(props.fields[i].id);

        if (checkbox.checked) {
          input.type = "text";
        } else {
          input.type = "password";
        }
      } else {
        continue;
      }
    }
  }
  function storeLocal(event) {
    let checkbox = event.target;
    if (checkbox.checked) {
      context.setRememberUser(true);
    } else {
      context.setRememberUser(false);
    }
  }

  return (
    <div className="login-form">
      <form onSubmit={props.action}>
        {props.fields.map((field) => {
          return (
            <div className="input-container" key={props.fields.indexOf(field)}>
              <label htmlFor={field.name}>{field.placeholder}</label>
              {props.preview && <div className="profile-button">     
                 <img src={props.preview} alt="Profile Preview" style={{ width: 100, height: 100, borderRadius: "50%" }} />
                 </div>}
              <input
                type={field.type}
                placeholder={field.placeholder}
                name={field.name}
                defaultValue={props.default}
                id={field.id || ""}
                ref={field.ref}
                onChange={props.onImageChange}
                required
              />
            </div>
          );
        })}
        {props.remember && (
          <div className="checkbox-container">
            <input type="checkbox" onClick={storeLocal} name="passtoggle" />
            <label htmlFor="passtoggle">Mantener sesión</label>
          </div>
        )}
        {props.showPassword && (
          <div className="checkbox-container">
            <input type="checkbox" onClick={myFunction} name="passtoggle" />
            <label htmlFor="passtoggle">Mostrar contraseña</label>
          </div>
        )}
        <div className="submit-container">
          <input
            type="submit"
            value={props.submitValue}
            id={props.submitValue + props.fields[0].name}
          />
        </div>
      </form>
      {props.error.status && (
        <span className="error-span">{props.error.message}</span>
      )}
    </div>
  );
};

export default Form;
