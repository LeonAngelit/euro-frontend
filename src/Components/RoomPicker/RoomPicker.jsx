import { React, useContext, useState, useRef } from "react";
import "./RoomPicker.Component.css";
import AppContext from "../../Storage/AppContext";
import { VscChevronRight } from "react-icons/vsc";
import { FiShare2 } from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai";
import { IconContext } from "react-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import Form from "../Form/Form";
import Modal from "../Modal/Modal";
import config from "../../config/config";
import { validateUserNameRegex } from "../../utils/regexUtils";
import useUpdateUserData from "../../utils/useUpdateUserData";

const RoomPicker = (props) => {
	const context = useContext(AppContext);
	const [error, setError] = useState({});
	const navigate = useNavigate();
	const roomNameRef = useRef(null);

	async function selectRoom(event) {
		let button = event.currentTarget;
		initializeRoom(button.id);
	}

	async function shareRoom(event) {
		event.preventDefault();
		let button = event.currentTarget;
		await getRoomToken(button.getAttribute("data"), button.getAttribute("name"));
	}

	async function initializeRoom(roomId) {
		await axios
			.get(`${config.baseUrl}rooms/${roomId}/${context.user_logged?.id}`, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 200) {
					const userToUpdate = response.data.users.find(
						(element) => element.id == context.user_logged?.id
					);
					context.setUserLogged((user) => {
						return {
							...user,
							countries: userToUpdate.countries,
						};
					});
					context.setCurrentRoom((old) => ({
						...old,
						current: response.data,
					}));
				}
			}).finally(() => {
				navigate("/room");
			}
			)
	}

	async function forgetRoom(id) {
		const data = {
			userId: parseInt(context.user_logged?.id),
			roomId: parseInt(id),
		};
		await axios
			.post(`${config.baseUrl}rooms/remove-user`, data, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 204) {
					useUpdateUserData(context, navigate);
				}
			})
			.catch((error) => {
				return error.response.data.message;
			});
	}

	async function deleteRoom(id) {
		await axios
			.delete(`${config.baseUrl}rooms/${id}/${context.user_logged?.id}`, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 200) {
					useUpdateUserData(context, navigate);
				}
			})
			.catch((error) => {
				return error.response.data.message;
			});
	}

	async function getRoomToken(roomId, roomName) {
		await axios
			.get(`${config.baseUrl}rooms/generateRoomtoken/${roomId}/${context.user_logged?.id}`, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 200) {
					let url = window.location.origin + "/join-room?roomAuth=" + response.data;
					if (navigator.canShare) {
						navigator.share({
							title: `Participa conmigo en la sala ${roomName}!`,
							text: `Participa conmigo en la sala ${roomName}!\nHaz clic en el link para unirte a la sala:\n `,
							url: url
						}).catch(err => console.error("Error sharing:", err));
					} else {
						// Fallback for devices that don’t support Web Share API
						navigator.clipboard.writeText(url);
						alert("Link copiado al portapapeles");
					}
				}
			}).catch((error) => {
				return ''
			})
	}

	function updateRoomName(event, roomId) {
		event.preventDefault()
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
		setError(false);
		let data = {
			name: roomNameRef.current.value,
		};
		udpateRoomData(roomId, data);
	}

	async function udpateRoomData(roomId, data) {
		await axios
			.put(
				`${config.baseUrl}rooms/${roomId}/${context.user_logged?.id}`,
				data,
				{
					headers: {
						Accept: "application/json",
						bearer: `${context.x_token}`,
					},
				}
			).then(async (response) => {
				if (response.status == 200) {
					await axios
						.get(
							`${config.baseUrl}users/${context.user_logged?.id}`,
							{
								headers: {
									Accept: "application/json",
									bearer: `${context.x_token}`,
								},
							}
						).then((response) => {
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
								context.setUserLogged(response.data);
							}
						})
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

	return (
		<>
			{props.rooms?.length > 0 ? (
				props.rooms.map((room) => {
					return (
						<div className="room-card" key={props.rooms.indexOf(room)}>
							<article className="room-container">
								<button
									id={room.id}
									onClick={selectRoom}
									className="room-icon-container room-name"
								>
									<p>{room.name}</p>
									<IconContext.Provider
										value={{ color: "black", size: "20px" }}
									>
										<VscChevronRight style={{ strokeWidth: 1 }} />
									</IconContext.Provider>
								</button>
								{room.adminId == context.user_logged?.id && (
									<button
										id={room.id}
										onClick={(event) => {
											event.preventDefault()
											let element = event.currentTarget;
											context.setModal({
												visible: true,
												confirm: true,
												component: <Form
													action={(event) => updateRoomName(event, element.id)}
													error={error}
													submitValue="Enviar"
													fields={[
														{
															name: "nombreSala",
															placeholder: "Nuevo nombre de la sala",
															id: "nombreSala",
															type: "text",
															ref: roomNameRef,
														},
													]}
												/>,
												onaccept: () => {
													deleteRoom(element.id);
													context.setModal({});
												},
												onclick: () => context.setModal({}),
											});
										}}
										className="room-icon-edit-container"
									>
										<IconContext.Provider
											value={{ color: "black", size: "20px" }}
										>
											<AiOutlineEdit style={{ strokeWidth: 1 }} />
										</IconContext.Provider>
									</button>
								)}
								<button
									id={`share-${room.id}`}
									data={room.id}
									name={room.name}
									onClick={shareRoom}
									className="room-icon-container">
									<IconContext.Provider
										value={{ size: "20px" }}
									>
										<FiShare2 />
									</IconContext.Provider>
								</button>
							</article>
							<div className="room-actions">
								<button
									id={room.id}
									onClick={(event) => {
										let element = event.currentTarget;
										context.setModal({
											visible: true,
											message:
												"¿Deseas olvidar la sala? Podrás volver a unirte introduciendo id y contraseña en el formulario",
											confirm: true,
											onaccept: () => {
												forgetRoom(element.id);
												context.setModal({});
											},
											onclick: () => context.setModal({}),
										});
									}}
								>
									Olvidar
								</button>
								{room.adminId == context.user_logged?.id && (
									<button
										id={room.id}
										onClick={(event) => {
											let element = event.currentTarget;
											context.setModal({
												visible: true,
												message:
													"¿Deseas eliminar la sala? Esta acción es irreversible",
												confirm: true,
												onaccept: () => {
													deleteRoom(element.id);
													context.setModal({});
												},
												onclick: () => context.setModal({}),
											});
										}}
										className="delete-button"
									>
										<IconContext.Provider
											value={{ color: "white", size: "20px" }}
										>
											<div className="header-icon-container">
												<MdDeleteForever />
												<p>Eliminar</p>
											</div>
										</IconContext.Provider>
									</button>
								)}
							</div>
						</div>
					);
				})
			) : (
				<p>Actualmente no te has registrado en ninguna sala.</p>
			)}
		</>
	);
};

export default RoomPicker;
