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
import { validateRegex, validateUserNameRegex } from "../../utils/regexUtils";
import bcrypt from "bcryptjs";
import config from "../../config/config";
 

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
	const userNameRef = useRef(null);
	const colorRef = useRef(null);
	let data;

	function updateUserData(event, data) {
		axios
			.put(
				`${config.baseUrl}users/${context.user_logged.id}`,
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
					event.target.reset();
					context.setUserLogged(response.data);
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
			});
	}

	function updateUserName(event) {
		event.preventDefault();
		if (
			!validateUserNameRegex(userNameRef.current.value, () =>
				setError({
					status: true,
					message:
						"Nombre de usuario no válido, debe contener 5 a 25 caracteres, evita caracteres especiales",
				})
			)
		) {
			return false;
		}
		setError(false);
		data = {
			username: userNameRef.current.value,
		};
		updateUserData(event, data);
	}

	function updatePassword(event) {
		event.preventDefault();
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

		updateUserData(event, data);
	}

	function updateColor(event) {
		event.preventDefault();
		data = {
			color: colorRef.current.value,
		};

		updateUserData(event, data);
	}

	return (
		<div className="container details-container">
			<div className="section-one">
				<Collapsible title={"Cambiar nombre de usuario: "}>
					<Form
						action={updateUserName}
						error={error}
						submitValue="Enviar"
						fields={[
							{
								name: "nombreUsuario",
								placeholder: "Nombre de usuario",
								id: "nombreUsuario",
								type: "text",
								ref: userNameRef,
							},
						]}
					/>
				</Collapsible>

				<Collapsible title={"Cambiar contraseña: "}>
					<Form
						action={updatePassword}
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
						action={updateColor}
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
			</div>

			<div className="section-two">
				<button className="delete-user-button">Eliminar cuenta</button>
			</div>

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
