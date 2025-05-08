import React, { useContext, useRef, useState, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateEmailRegex } from "../../utils/regexUtils";
import Form from "../../Components/Form/Form";
import config from "../../config/config";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";
import useValidateEmail from "../../utils/useValidateEmail";
import useUpdateUserData from "../../utils/useUpdateUserData";
import useValidateToken from "../../utils/useValidateToken";
import useHandleCloseSession from "../../utils/useHandleCloseSession";


const MissingEmail = () => {
	const context = useContext(AppContext);
	const emailRef = useRef(null);
	const navigate = useNavigate();
	const [error, setError] = useState(false);
	const [emailSent, setEmailSent] = useState(false);


	async function validateUserToken() {
		const isValidToken = await useValidateToken(context);
		if (!context.user_logged || !isValidToken) {
			useHandleCloseSession(context);
			useNavigateWithCallback(navigate, "/login");
		}
	}
	useEffect(() => {
		async function validateEmail() {
			if (window.location.href.includes(config.confirmemailLink) && emailSent) {
				const response = await useValidateEmail(context, window.location.href.split(config.confirmemailLink)[1]);
				if (response.result) {
					context.setModal({
						visible: true,
						message: "Email confirmado",
						status: "success",
						confirm: context.setModal({}),
					});
					setTimeout(() => {
						context.setModal({});
					}, 5000);
					useUpdateUserData(context, navigate)
				} else {
					context.setModal({
						visible: true,
						message: response.data,
						status: "error",
						confirm: context.setModal({}),
					});
					setTimeout(() => {
						context.setModal({});
					}, 5000);
					useNavigateWithCallback(navigate, "/missing-email");
				}
			}
		}
		validateEmail();
		if (context.user_logged?.email != null && !emailSent) {
			useNavigateWithCallback(navigate, "/app");
		}
	}, [emailSent]);

	useEffect(() => {
		if (context.user_logged) {
			validateUserToken();
			isEmailSent();
			if (context.user_logged?.email != null) {
				useNavigateWithCallback(navigate, "/app");
			}
		}

	}, [context.user_logged]);

	async function isEmailSent() {
		const mailResponse = await axios.get(`${config.baseUrl}users/validateEmailSent/${context.user_logged.id}`, {
			headers: {
				Accept: "application/json",
				Bearer: context.x_token,
			},
		}).then((response) => {
			return response;
		}).catch((error) => {
			return error
		})
		setEmailSent(mailResponse.data?.emailSent || false)
	}

	async function requestEmail(event) {
		event.preventDefault();
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
		await axios
			.put(
				`${config.baseUrl}users/${context.user_logged?.id}`,
				{ email: emailRef.current.value },
				{
					headers: {
						Accept: "application/json",
						Bearer: context.x_token,
					},
				}
			)
			.then((response) => {
				if (response.status == 200) {
					context.setModal({
						visible: true,
						message: "Email de confirmación enviado",
						status: "success",
						confirm: context.setModal({}),
					});
					setTimeout(() => {
						context.setModal({});
					}, 5000);
					event.target.reset();
					setEmailSent(true)
				}
			})
			.catch((error) => {
				if (error.response.status == 404) {
					context.setModal({
						visible: true,
						message: "Usuario no encontrado",
						status: "error",
						confirm: context.setModal({}),
					});
					setTimeout(() => {
						context.setModal({});
					}, 5000);
				} else {
					context.setModal({
						visible: true,
						message: error.response.data.message,
						status: "error",
						confirm: context.setModal({}),
					});
					setTimeout(() => {
						context.setModal({});
					}, 5000);
				}
			});
	}

	return (
		<>

			<div className="container">
				{context.user_logged && (context.user_logged?.email == null ? !emailSent ?
					<div>
						<p style={{ textAlign: "center" }}>
							Tras la última actualización de la aplicación, se requiere que todos los usuarios registrados tengan una dirección de correo electrónico asociada
						</p>
						<p style={{ fontWeight: "bold", marginTop: "1rem", textAlign: "center" }}>
							Por lo que deberás introducir un email válido en el formulario más abajo para seguir usando la app 👇 Muchas gracias
						</p>
						<Form
							action={requestEmail}
							error={error}
							submitValue="Enviar"
							fields={[
								{
									name: "email",
									placeholder: "Correo electrónico",
									type: "email",
									ref: emailRef,
									required: true,
								},
							]}
						/>
					</div>
					: <div>
						<p style={{ textAlign: "center" }}>
							Revisa tu bandeja de entrada para confirmar tu correo.
						</p>
						<br></br>
						<p style={{ fontWeight: "bold", marginTop: "1rem", textAlign: "center" }}>Si no lo encuentras, revisa la bandeja de correo no deseado.</p>
					</div>
					: <div>
						<p style={{ textAlign: "center" }}>
							Actualización correcta, serás redirigido a la app automáticamente
						</p>
						<br></br>
						<p style={{ fontWeight: "bold", marginTop: "1rem", textAlign: "center" }}>Si no eres redirigido automáticamente, recarga la página</p>
					</div>)}
			</div>
		</>

	);
};

export default MissingEmail;
