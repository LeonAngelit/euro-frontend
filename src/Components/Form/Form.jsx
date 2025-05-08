import { React, useContext, useState } from "react";
import AppContext from "../../Storage/AppContext";
import "./Form.Component.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Form = (props) => {
  const context = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showButton, setShowButton] = useState(false);

  function myFunction(event) {
    event.preventDefault();
    if (showPassword) {
      if (showPassword.includes(event.currentTarget.id)) {
        let tempShowPassword = showPassword.filter(id => id != event.currentTarget.id)
        setShowPassword(tempShowPassword);
      } else {
        setShowPassword([...showPassword, event.currentTarget.id])
      }
    } else {
      setShowPassword([event.currentTarget.id])
    }

  }

  function handlePasswordChange(event, ref) {
    event.preventDefault();
    if (ref?.current?.value != "") {
      showButton && showButton.length > 0 ? setShowButton([...showButton, event.target.id]) : setShowButton([event.target.id])
    } else {
      if (showButton && showButton.length > 1) {
        let tempShowButton = showButton.filter(id => id != event.target.id)
        setShowButton(tempShowButton)
      } else {
        setShowButton(false)
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
              <label htmlFor={field.name}>{field.label}</label>
              {props.preview && <div className="profile-button">
                <img src={props.preview} alt="Profile Preview" style={{ width: 100, height: 100, borderRadius: "50%" }} />
              </div>}
              {
                field.type == "password" ? <div className="password-wrapper">
                  <input
                    type={showPassword && showPassword.includes(field.id) ? "text" : "password"}
                    placeholder={field.placeholder}
                    name={field.name}
                    defaultValue={props.default}
                    id={field.id || ""}
                    ref={field.ref}
                    onChange={(event) => handlePasswordChange(event, field.ref)}
                    required={field.required}
                  />
                  {props.showPassword && (
                    <button type="button" onClick={myFunction} name="passtoggle" id={field.id || ""}>{showButton && showButton.includes(field.id) && <FontAwesomeIcon icon={showPassword && showPassword.includes(field.id) ? faEyeSlash : faEye} />}</button>
                  )}
                </div> : <input
                  type={field.type}
                  placeholder={field.placeholder}
                  name={field.name}
                  defaultValue={props.default}
                  id={field.id || ""}
                  ref={field.ref}
                  onChange={props.onImageChange}
                  required={field.required}
                />}
            </div>
          );
        })}
        {props.remember && (
          <div className="checkbox-container">
            <input type="checkbox" onClick={storeLocal} name="passtoggle" />
            <label htmlFor="passtoggle">Mantener sesión</label>
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
      {props.error?.status && (
        <span className="error-span">{props.error?.message}</span>
      )}
    </div>
  );
};

export default Form;
