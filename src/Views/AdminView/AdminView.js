import React, { useContext, useRef, useState, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import Form from "../../Components/Form/Form";
import "./AdminView.componen.css";
import { validateRegex } from "../../utils/regexUtils";
import bcrypt from "bcrypt-nodejs";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import Collapsible from "../../Components/Collapsible/Collapsible";
window.Buffer = window.Buffer || require("buffer").Buffer;

const Login = () => {
	const context = useContext(AppContext);
	const d = new Date();
	const passRef = useRef(null);
	const passTwoRef = useRef(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		if (!context.updatable) {
			useHandleCloseSession(context);
		}
	}, []);

	function updateLinks(event) {
		event.preventDefault();
		axios
			.get(
				`${
					config.baseUrl
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

	function setUpdatable(event) {
		event.preventDefault();
		let data;
		if (event.target.id == "updatable_countries") {
			data = {
				updatable: !context.updatable.updatable,
			};
		}
		if (event.target.id == "updatable_users") {
			data = {
				updatable_user: !context.updatable.updatable_user,
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

		axios
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
		</div>
	);
};

export default Login;
