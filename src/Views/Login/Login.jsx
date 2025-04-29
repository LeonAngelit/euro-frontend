import React, { useContext, useRef, useState, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { validateEmailRegex, validateRegex, validateUserNameRegex } from "../../utils/regexUtils";
import Form from "../../Components/Form/Form";
import bcrypt from "bcryptjs";
import config from "../../config/config";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";


const Login = () => {
	const context = useContext(AppContext);
	const passwordRef = useRef(null);
	const userNameRef = useRef(null);
	const [callbackUrl, setCallbackUrl] = useState('');
	const navigate = useNavigate();
	const [error, setError] = useState(false);

	useEffect(() => {
		if (context.user_logged) {
			if (callbackUrl != '' && callbackUrl.includes(config.confirmemailLink)) {
				navigate(window.location.href.split("callback_url=")[1])
			} else {
				useNavigateWithCallback("/app", callbackUrl)
			}
		}
	}, [context.user_logged]);

	useEffect(() => {
		if (window.location.href.includes("callback_url")) {
			setCallbackUrl("?callback_url=" + window.location.href.split("callback_url=")[1]);
		}
	}, [])

	async function login(event) {
		event.preventDefault();
		if (!(validateUserNameRegex(userNameRef.current.value) || validateEmailRegex(userNameRef.current.value))) {
			setError({
				status: true,
				message:
					"Nombre de usuario o email no válido",
			})

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

		const data = {
			name: userNameRef.current.value,
			password: passwordRef.current.value.split('').reverse().join('')
		}
		await axios
			.post(
				`${config.baseUrl}users/login`, data,
				{
					headers: {
						Accept: "application/json",
						Bearer: context.x_token,
					},
				}
			)
			.then((response) => {
				if (response.status == 200) {
					context.setUserLogged(response.data);
					
				} else {
					setError({
						status: true,
						message: "Usuario o contaseña incorrectos",
					});
				}
			})
			.catch((error) => {
				if (error.response.status == 404) {
					setError({
						status: true,
						message: "Usuario no encontrado",
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
				action={login}
				error={error}
				submitValue="Login"
				showPassword={true}
				remember={true}
				fields={[
					{
						name: "username",
						placeholder: "Nombre de usuario o email",
						type: "text",
						ref: userNameRef,
					},
					{
						name: "password",
						placeholder: "Contraseña",
						id: "passwordField",
						type: "password",
						ref: passwordRef,
					},
				]}
			/>
			<div className="subtitle">
				<p>
					Inicia sesión o <Link to={"/signup" + callbackUrl}>Crea una cuenta</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
