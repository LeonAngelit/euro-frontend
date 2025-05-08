import React, { useContext, useRef, useState, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { validateEmailRegex, validateRegex, validateUserNameRegex } from "../../utils/regexUtils";
import Form from "../../Components/Form/Form";
import config from "../../config/config";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";
import useGetAuthToken from "../../utils/useGetAuthToken";
import { GoogleLogin } from '@react-oauth/google';


const Login = () => {
	const context = useContext(AppContext);
	const passwordRef = useRef(null);
	const userNameRef = useRef(null);
	const [callbackUrl, setCallbackUrl] = useState('');
	const navigate = useNavigate();
	const [error, setError] = useState(false);

	useEffect(() => {
		if (context.user_logged) {
			useNavigateWithCallback(navigate, "/app");
		}
	}, [context.user_logged]);

	useEffect(() => {
		if (window.location.href.includes("callback_url")) {
			setCallbackUrl("?callback_url=" + window.location.href.split("callback_url=")[1]);
		}
	}, [])

	async function googleLogin(data) {
		const token = await useGetAuthToken(context);
		try {
			const response = await axios.post(
				`${config.baseUrl}users/google-login`,
				data,
				{
					headers: {
						Accept: "application/json",
						Bearer: token,
					},
				}
			);

			if (response.status === 200) {
				context.setXtoken(`${response.data.token}`); // Set new user token for future requests
				context.setUserLogged(response.data.user);
			} else {
				setError({
					status: true,
					message: "Usuario o contaseña incorrectos",
				});
			}
		} catch (error) {
			if (error?.response?.status === 404) {
				setError({
					status: true,
					message: "Usuario no encontrado",
				});
			} else {
				setError({
					status: true,
					message: error?.response?.data?.message || "Error de servidor",
				});
			}
		}
	}

	async function login(event) {
		event.preventDefault();

		const token = await useGetAuthToken(context);

		if (!token) {
			setError({ status: true, message: "Token inválido" });
			return;
		}

		if (!(validateUserNameRegex(userNameRef.current.value) || validateEmailRegex(userNameRef.current.value))) {
			setError({
				status: true,
				message: "Nombre de usuario o email no válido",
			});
			return;
		}

		if (
			!validateRegex(passwordRef.current.value, () =>
				setError({
					status: true,
					message: "Contraseña no válida, debe contener al menos 8 caracteres, incluyendo números y mayúscula",
				})
			)
		) {
			return;
		}

		const data = {
			name: userNameRef.current.value,
			password: passwordRef.current.value.split('').reverse().join('')
		};

		try {
			const response = await axios.post(
				`${config.baseUrl}users/login`,
				data,
				{
					headers: {
						Accept: "application/json",
						Bearer: token,
					},
				}
			);

			if (response.status === 200) {
				context.setXtoken(`${response.data.token}`); // Set new user token for future requests
				context.setUserLogged(response.data.user);
			} else {
				setError({
					status: true,
					message: "Usuario o contaseña incorrectos",
				});
			}
		} catch (error) {
			if (error?.response?.status === 404) {
				setError({
					status: true,
					message: "Usuario no encontrado",
				});
			} else {
				setError({
					status: true,
					message: error?.response?.data?.message || "Error de servidor",
				});
			}
		}
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
						label: "Nombre de usuario o email",
						type: "text",
						ref: userNameRef,
						required: true,
					},
					{
						name: "password",
						label: "Contraseña",
						id: "passwordField",
						type: "password",
						ref: passwordRef,
						required: true,
					},
				]}
			/>
			<div className="subtitle">
				<p>
					Inicia sesión o <Link to={"/signup" + callbackUrl}>Crea una cuenta</Link>
				</p>
				<GoogleLogin
					onSuccess={credentialResponse => {
						googleLogin(credentialResponse);
					}}
					onError={() => {
						console.error("Login Failed");
					}}
				/>
			</div>
		</div>
	);
};

export default Login;
