import React, { useContext, useRef, useState, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateEmailRegex } from "../../utils/regexUtils";
import Form from "../../Components/Form/Form";
import Modal from "../../Components/Modal/Modal";
import config from "../../config/config";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";
import useValidateEmail from "../../utils/useValidateEmail";
import useGetAuthToken from "../../utils/useGetAuthToken";
import useUpdateUserData from "../../utils/useUpdateUserData";


const MissingEmail = () => {
	const context = useContext(AppContext);
	const emailRef = useRef(null);
	const navigate = useNavigate();
	const [modal, setModal] = useState({});
	const [error, setError] = useState(false);

	useEffect(() => {
		async function validateEmail() {
			if (window.location.href.includes(config.confirmemailLink)) {
				const response = await useValidateEmail(context, window.location.href.split(config.confirmemailLink)[1]);
				if (response.result) {
					setModal({
						visible: true,
						message: "Actualización correcta",
						status: "success",
						confirm: setModal({}),
					});
					setTimeout(() => {
						setModal({});
					}, 5000);
					useUpdateUserData(context, navigate)
					useNavigateWithCallback(navigate, "/app");
				} else {
					setModal({
						visible: true,
						message: response.message,
						status: "error",
						confirm: setModal({}),
					});
					setTimeout(() => {
						setModal({});
					}, 5000);
				}
			}
		}
		validateEmail();
		if (context.user_logged?.email && context.user_logged?.email != '') {
			useNavigateWithCallback(navigate, "/app");
		}
	}, [context.x_token]);

	useEffect(() => {
			useGetAuthToken(context)
		if (context.user_logged?.email && context.user_logged?.email != '') {
			useNavigateWithCallback(navigate, "/app");
		}
	}, [context.user_logged]);



	function requestEmail(event) {
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
		axios
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
				if (error.response.status == 404) {
					setModal({
						visible: true,
						message: "Usuario no encontrado",
						status: "error",
						confirm: setModal({}),
					});
					setTimeout(() => {
						setModal({});
					}, 5000);
				} else {
					setModal({
						visible: true,
						message: error.response.data.message,
						status: "error",
						confirm: setModal({}),
					});
					setTimeout(() => {
						setModal({});
					}, 5000);
				}
			});
	}

	return (
		<>

			<div className="container">
				{(
					context.user_logged?.email == null 
					&& 
					(context.user_logged?.email_sent == null || ((Date.now() - context.user_logged?.email_sent) / 3600000) > 1)) ?
					<div>
						<p style={{ textAlign: "center" }}>
							Tras la última actualización de la aplicación, se requiere que todos los usuarios registrados tengan una dirección de correo electrónico asociada
						</p>
						<p  style={{ fontWeight: "bold", marginTop: "1rem", textAlign: "center" }}>
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
				}
			</div>


			{modal.visible && !modal.confirm && (
				<Modal
					message={modal.message}
					status={modal.status}
					onclick={() => setModal({})}
				/>
			)}
		</>

	);
};

export default MissingEmail;
