import React, { useContext, useRef, useState, useEffect } from "react";
import "./CreateRoom.Component.css";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import useValidateToken from "../../utils/useValidateToken";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import useUpdateUserData from "../../utils/useUpdateUserData";
import { useNavigate } from "react-router-dom";
import { validateRegex, validateUserNameRegex } from "../../utils/regexUtils";
import bcrypt from "bcryptjs";
import Form from "../../Components/Form/Form";
import config from "../../config/config";

 

const CreateRoom = () => {
	const context = useContext(AppContext);
	const passwordRef = useRef(null);
	const passwordTwodRef = useRef(null);
	const roomNameRef = useRef(null);
	const [error, setError] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		async function validateUserToken() {
			const isValidToken = await useValidateToken(context);
			if (!context.user_logged || !isValidToken) {
				useHandleCloseSession(context);
				if (window.location.pathname == "/join-room" || window.location.href.includes(config.confirmemailLink)) {
					useNavigateWithCallback(navigate, "/login?callback_url=" + window.location.href);
				} else {
					useNavigateWithCallback(navigate, "/login");
				}
			}
		}
		validateUserToken();
	}, []);

	async function crearSala(event) {
		event.preventDefault();
		if (
			!validateUserNameRegex(roomNameRef.current.value, () =>
				setError({
					status: true,
					message:
						"Nombre de sala no válido, debe contener 5 a 25 caracteres, evita caracteres especiales",
				})
			)
		) {
			return false;
		}

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
			adminId: context.user_logged?.id,
		};
		await axios
			.post(`${config.baseUrl}rooms`, data, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 201) {
					useUpdateUserData(context, navigate);
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
