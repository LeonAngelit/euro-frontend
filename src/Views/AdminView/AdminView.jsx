import React, { useContext, useRef, useState, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import Form from "../../Components/Form/Form";
import "./AdminView.componen.css";
import { validateRegex } from "../../utils/regexUtils";
import bcrypt from "bcryptjs";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import Collapsible from "../../Components/Collapsible/Collapsible";
import config from "../../config/config";


const Login = () => {
	const context = useContext(AppContext);
	const d = new Date();
	const passRef = useRef(null);
	const passTwoRef = useRef(null);
	const modelRef = useRef(null);
	const imgPathRef = useRef(null);
	const framesRef = useRef(null);
	const promptRef = useRef(null);
	const cfgRef = useRef(null);
	const endPercentRef = useRef(null);
	const strengthRef = useRef(null);
	const genStepsRef = useRef(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		if (!context.updatable) {
			useHandleCloseSession(context);
		}
	}, []);

	async function updateLinks(event) {
		event.preventDefault();
		await axios
			.get(
				`${config.baseUrl
				}countries/updateLinks/${d.getFullYear()}`,
				{
					headers: {
						Accept: "application/json",
						Bearer: context.x_token,
					},
				}
			)
			.then((response) => {
				if (response.status == 200) {
					setError(false);
				} else {
					setError({
						status: true,
						message: response.data.message,
					});
				}
			})
			.catch((error) => {
				setError({
					status: true,
					message: error.response.data.message,
				});
			});
	}

	async function setUpdatable(event) {
		event.preventDefault();
		let data;
		if (event.target.id == "updatable_countries") {
			data = {
				updatable: !context.updatable?.updatable,
			};
		}
		if (event.target.id == "updatable_users") {
			data = {
				updatable_user: !context.updatable?.updatable_user,
			};
		}

		if (event.target.id == "updatable_refresh_enabled") {
			data = {
				refresh_enabled: !context.updatable?.refresh_enabled,
			};
		}
		if (event.type == "submit") {
			if (passRef.current.value != passTwoRef.current.value) {
				setError({ status: true, message: "Las contraseñas no coinciden" });
				return false;
			}
			if (
				!validateRegex(passRef.current.value, () =>
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
			const pass = bcrypt.hashSync(passRef.current.value, salt, null);
			data = {
				master_password: pass,
			};
		}

		await axios
			.put(`${config.baseUrl}updatable`, data, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 200) {
					context.setUpdatable(response.data);
					setError(false);
					if (event.type == "submit") {
						event.target.reset();
					}
				} else {
					setError({
						status: true,
						message: response.data.message,
					});
				}
			})
			.catch((error) => {
				setError({
					status: true,
					message: error.response.data.message,
				});
			});
	}

	async function archiveResults(event) {
		event.preventDefault();
		await axios
			.get(
				`${config.baseUrl}countries/archive/export/${d.getFullYear()}`,
				{
					headers: {
						Accept: "application/json",
						Bearer: context.x_token,
					},
				}
			)
			.then((response) => {
				if (response.status == 200) {
					setError(false);
				} else {
					setError({
						status: true,
						message: response.data.message,
					});
				}
			}
			)
			.catch((error) => {
				setError({
					status: true,
					message: error.response.data.message,
				});
			}
			);
	}

	async function sendModelRequest(data) {
		await axios
			.post(
				`${config.baseUrl}${config.requestsUrl}`,
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
						message: response.data.message,
						status: "success",
						confirm: context.setModal({}),
					});
					setTimeout(() => {
						context.setModal({});
					}, 5000);
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

	async function deleteRequests() {
		await axios
			.delete(
				`${config.baseUrl}${config.requestsBaseUrl}`,
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
						message: response.data.toString(),
						status: "success",
						confirm: context.setModal({}),
					});
					setTimeout(() => {
						context.setModal({});
					}, 5000);
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
	async function handleCreateRequest(event) {
		event.preventDefault();
		let data;
		switch (modelRef.current.value) {
			case "clean":
				data = {
					"model": modelRef.current.value,
					"imgPath": "no need"
				}
				await sendModelRequest(data);
				break;
			case "image_to_video":
				data = {
					"model": modelRef.current.value,
					"imgPath": imgPathRef.current.value,
					"frames": framesRef.current.value,
					"prompt": promptRef.current.value
				}
				await sendModelRequest(data);
				break;
			case "anime_to_real":
				data = {
					"model": modelRef.current.value,
					"endPercent": endPercentRef.current.value,
					"strength": strengthRef.current.value,
					"genSteps": genStepsRef.current.value,
					"cfg": cfgRef.current.value,
					"imgPath": imgPathRef.current.value,
					"prompt": promptRef.current.value
				}
				await sendModelRequest(data);
				break;
			case "generate_image":
				data = {
					"model": modelRef.current.value,
					"prompt": promptRef.current.value,
					"imgPath": "no need"
				}
				await sendModelRequest(data);
				break;
			case "upscale":
				data = {
					"model": modelRef.current.value,
					"imgPath": imgPathRef.current.value
				}
				await sendModelRequest(data);
				break;
			case "delete":
				await deleteRequests()
				break;
			default: console.error("invalid option")
		}
	}

	return (
		<div className="container">
			<div className="buttons-container">
				<button
					className="admin-button button-green"
					id="update_links"
					onClick={updateLinks}
				>
					Actualizar links
				</button>
				{context.updatable.updatable ? (
					<button
						className="admin-button button-green"
						id="updatable_countries"
						onClick={setUpdatable}
					>
						Países OK
					</button>
				) : (
					<button
						className="admin-button button-red"
						id="updatable_countries"
						onClick={setUpdatable}
					>
						Países NO
					</button>
				)}
				{context.updatable.updatable_user ? (
					<button
						className="admin-button button-green"
						id="updatable_users"
						onClick={setUpdatable}
					>
						Usuarios OK
					</button>
				) : (
					<button
						className="admin-button button-red"
						id="updatable_users"
						onClick={setUpdatable}
					>
						Usuarios NO
					</button>
				)}

				{context.updatable.refresh_enabled ? (
					<button
						className="admin-button button-green"
						id="updatable_refresh_enabled"
						onClick={setUpdatable}
					>
						Puntos OK
					</button>
				) : (
					<button
						className="admin-button button-red"
						id="updatable_refresh_enabled"
						onClick={setUpdatable}
					>
						Puntos NO
					</button>
				)}

				<button
					className="admin-button button-blue"
					id="archive_results"
					onClick={archiveResults}
				>
					Exportar resultados
				</button>
			</div>
			<Collapsible title={"Cambiar contraseña: "}>
				<Form
					action={setUpdatable}
					error={error}
					submitValue="Enviar"
					showPassword={true}
					fields={[
						{
							name: "password",
							placeholder: "Contraseña",
							id: "passwordField",
							type: "password",
							ref: passRef,
						},
						{
							name: "password",
							placeholder: "Repetir contraseña",
							id: "passwordTwoField",
							type: "password",
							ref: passTwoRef,
						},
					]}
				/>
			</Collapsible>
			<div className="requests-container">
				<select ref={modelRef}>
					<option value="clean">Clean request</option>
					<option value="image_to_video">img2video request</option>
					<option value="anime_to_real">anime to real request</option>
					<option value="generate_image">generate image request</option>
					<option value="upscale">upscale request</option>
					<option value="delete">Delete request</option>
				</select>
				<textarea placeholder="prompt goes here" ref={promptRef}>

				</textarea>
				<Form
					action={handleCreateRequest}
					submitValue="Enviar"
					fields={[
						{
							name: "imgPath",
							placeholder: "imgPath",
							id: "imgPath",
							type: "text",
							ref: imgPathRef,
							required: false,
						},
						{
							name: "frames",
							placeholder: "frames",
							id: "frames",
							type: "text",
							ref: framesRef,
							required: false,
						},
						{
							name: "strength",
							placeholder: "strength",
							id: "strength",
							type: "text",
							ref: strengthRef,
							required: false,
						},
						{
							name: "genSteps",
							placeholder: "genSteps",
							id: "genSteps",
							type: "text",
							ref: genStepsRef,
							required: false,
						},
						{
							name: "cfg",
							placeholder: "cfg",
							id: "cfg",
							type: "text",
							ref: cfgRef,
							required: false,
						},
						{
							name: "endPercent",
							placeholder: "endPercent",
							id: "endPercent",
							type: "text",
							ref: endPercentRef,
							required: false,
						},

					]}
				/>
			</div>

		</div>
	);
};

export default Login;
