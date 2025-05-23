import React, { useContext, useState, useEffect, useRef } from "react";
import "./UserDetails.Component.css";
import AppContext from "../../Storage/AppContext";
import CountryPicker from "../../Components/CountryPicker/CountryPicker";
import { useNavigate } from "react-router-dom";
import Collapsible from "../../Components/Collapsible/Collapsible";
import Modal from "../../Components/Modal/Modal";
import useValidateToken from "../../utils/useValidateToken";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import Form from "../../Components/Form/Form";
import axios from "axios";
import { validateEmailRegex, validateRegex, validateUserNameRegex } from "../../utils/regexUtils";
import bcrypt from "bcryptjs";
import config from "../../config/config";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";
 

const UserDetails = () => {
	const context = useContext(AppContext);
	const [preview, setPreview] = useState(null)
	const navigate = useNavigate();
	const [error, setError] = useState({});
	const [currentCollapsed, setcurrentCollapsed] = useState(false);

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

	useEffect(() => {
		if (context.user_logged?.email == null && !window.location.href.includes(config.confirmemailLink)) {
			useNavigateWithCallback(navigate, "/missing-email");
		}
	}, [])
	
	const passRef = useRef(null);
	const pass2Ref = useRef(null);
	const userNameRef = useRef(null);
	const emailRef = useRef(null);
	const colorRef = useRef(null);
	const imageRef = useRef(null);
	let data;

	async function updateUserData(event, data) {
		await axios
			.put(
				`${config.baseUrl}users/${context.user_logged?.id}`,
				data,
				{
					headers: {
						Accept: "application/json",
						bearer: `${context.x_token}`,
					},
				}
			)
			.then((response) => {
				if (response.status == 200) {
					context.setModal({
						visible: true,
						message: "Actualización correcta",
						status: "success",
						confirm: context.setModal({}),
					});
					setTimeout(() => {
						context.setModal({});
					}, 5000);
					event.target.reset();
					context.setUserLogged(response.data);
				}
			})
			.catch((error) => {
				context.setModal({
					visible: true,
					message: error.response.data.message,
					status: "error",
					confirm: context.setModal({}),
				});
				setTimeout(() => {
					context.setModal({});
				}, 5000);
			});
	}

	function udpateUserEmail(event) {
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
		setError(false);
		data = {
			email: emailRef.current.value,
		};
		updateUserData(event, data);
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

	function updateImage(event) {
		event.preventDefault();
		const formData = new FormData();
		formData.append("image", imageRef.current.files[0]);
		updateUserData(event, formData);
	}

	const handleImageChange = (event) => {
		
		const file = event.target.files[0];
		if (file) {
		  setPreview(URL.createObjectURL(file));
		  
		}
	  };

	function handleCollapsed(){
		setcurrentCollapsed(!currentCollapsed);
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
								required: true,
							},
						]}
					/>
				</Collapsible>

				<Collapsible title={"Cambiar correo electrónico: "}>
					<Form
						action={udpateUserEmail}
						error={error}
						submitValue="Enviar"
						fields={[
							{
								name: "emaiUsuario",
								placeholder: "Correo electrónico",
								id: "emaiUsuario",
								type: "email",
								ref: emailRef,
								required: true,
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
								required: true,
							},
							{
								name: "passwordTwo",
								placeholder: "Repetir contraseña",
								id: "passwordTwo",
								type: "password",
								ref: pass2Ref,
								required: true,
							},
						]}
					/>
				</Collapsible>

				<Collapsible title={"Actualizar avatar: "}>
					<Form
						action={updateImage}
						error={error}
						submitValue="Enviar"
						fields={[
							{
								name: "profileImage",
								id: "profileImage",
								type: "file",
								ref: imageRef,
								required: true,			
							},
							
						]}
						preview = {preview}
						onImageChange= {handleImageChange}
					/>
				</Collapsible>


				<Collapsible title={"Cambiar color de tarjeta"}>
					<Form
						action={updateColor}
						error={error}
						default={context.user_logged?.color}
						submitValue="Enviar"
						fields={[
							{
								name: "Color",
								placeholder: "Color",
								id: "colorField",
								type: "color",
								ref: colorRef,
								required: true,
							},
						]}
					/>
				</Collapsible>
				<Collapsible title={"Cambiar países seleccionados"} collapsed={currentCollapsed}>
					<CountryPicker countries={context.songs} additionalAction={handleCollapsed} />
				</Collapsible>
			</div>

			<div className="section-two">
				<button className="delete-user-button">Eliminar cuenta</button>
			</div>
		</div>
	);
};

export default UserDetails;
