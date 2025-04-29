import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "../../Components/Form/Form";
import { validateRegex, validateUserNameRegex, validateEmailRegex } from "../../utils/regexUtils";
import bcrypt from "bcryptjs";
import config from "../../config/config";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";

const SignUp = () => {
	const context = useContext(AppContext);
	const passwordRef = useRef(null);
	const passwordTwodRef = useRef(null);
	const userNameRef = useRef(null);
	const emailRef = useRef(null);
	const navigate = useNavigate();
	const [error, setError] = useState(false);

	useEffect(() => {
		if (context.user_logged) {
			useNavigateWithCallback(navigate, "/app");
		}
	}, [context.user_logged]);
	

	async function getUsuario(event) {
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

		if (
			!validateEmailRegex(emailRef.current.value, () =>
				setError({
					status: true,
					message:
						"Correo electrónico no válido",
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
			username: userNameRef.current.value,
			email: emailRef.current.value,
			password: pass,
		};
		await axios
			.post(`${config.baseUrl}users/signup`, data, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 201) {
					updateUsuario(response.data.id);
				} else {
					setError({
						status: true,
						message: response.data.message,
					});
				}
			})
			.catch((error) => {
				if (error.status == 409) {
					setError({
						status: true,
						message: "Nombre de usuario no disponible",
					});
				} else {
					setError({
						status: true,
						message: error.response.data.message,
					});
				}
			});
	}

	async function updateUsuario(id) {
		await axios
			.get(`${config.baseUrl}users/${id}`, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 200) {
					{
						context.setUserLogged(response.data);
					}
				}
			})
			.catch((error) => {
				return error.response.data.message;
			});
	}

	return (
		<div className="container">
			<Form
				action={getUsuario}
				error={error}
				showPassword={true}
				submitValue="Registrarse"
				remember={true}
				fields={[
					{
						name: "username",
						placeholder: "Nombre de usuario",
						type: "text",
						ref: userNameRef,
					},
					{
						name: "email",
						placeholder: "Correo electrónico",
						type: "email",
						ref: emailRef,
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

export default SignUp;
