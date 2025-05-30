import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "../../Components/Form/Form";
import { validateRegex, validateUserNameRegex, validateEmailRegex } from "../../utils/regexUtils";
import bcrypt from "bcryptjs";
import config from "../../config/config";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";
import useGetAuthToken from "../../utils/useGetAuthToken"
import { GoogleLogin } from '@react-oauth/google';

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
	async function createNewUser(event) {
		event.preventDefault();
		const token = await useGetAuthToken(context)
		if (!token) {
			setError({ status: true, message: "Token inválido" });
			return;
		}
	
		
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
					Bearer: token,
				},
			})
			.then((response) => {
				if (response.status == 201) {
					context.setXtoken(response.data.token);
					context.setUserLogged(response.data.user);
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
						message: error.response.data.message
					});
				} else {
					setError({
						status: true,
						message: error.toString()
					});
				}
			});
	}

	return (
		<div className="container">
			<Form
				action={createNewUser}
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
						required: true,
					},
					{
						name: "email",
						placeholder: "Correo electrónico",
						type: "email",
						ref: emailRef,
						required: true,
					},
					{
						name: "password",
						placeholder: "Contraseña",
						type: "password",
						id: "passwordOne",
						ref: passwordRef,
						required: true,
					},
					{
						name: "password2",
						placeholder: "Repetir contraseña",
						id: "passwordTwo",
						type: "password",
						ref: passwordTwodRef,
						required: true,
					},
				]}
			/>
			<div className="google-container">
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

export default SignUp;
