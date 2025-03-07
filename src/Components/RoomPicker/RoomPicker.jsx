import { React, useContext, useState } from "react";
import "./RoomPicker.Component.css";
import AppContext from "../../Storage/AppContext";
import { VscChevronRight } from "react-icons/vsc";
import { FiShare2 } from "react-icons/fi";
import { IconContext } from "react-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import Modal from "../Modal/Modal";
import config from "../../config/config";
import useUpdateUserData from "../../utils/useUpdateUserData";

const RoomPicker = (props) => {
	const context = useContext(AppContext);
	const [modal, setModal] = useState({});
	const navigate = useNavigate();

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
		axios
			.get(`${config.baseUrl}rooms/${roomId}`, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 200) {
					const userToUpdate = response.data.users.find(
						(element) => element.id == context.user_logged.id
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
			userId: parseInt(context.user_logged.id),
			roomId: parseInt(id),
		};
		axios
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
		axios
			.delete(`${config.baseUrl}rooms/${id}`, {
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
			.get(`${config.baseUrl}rooms/generateRoomtoken/${roomId}`, {
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
								text: "Haz clic en el link para unirte a la sala:",
								url: url
							}).catch(err => console.error("Error sharing:", err));
						} else {
							// Fallback for devices that don’t support Web Share API
							navigator.clipboard.writeText(url);
							alert("Link copied to clipboard!");
						}
				}
			}).catch((error) => {
				return ''
			})
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
										setModal({
											visible: true,
											message:
												"¿Deseas olvidar la sala? Podrás volver a unirte introduciendo id y contraseña en el formulario",
											confirm: true,
											onaccept: () => {
												forgetRoom(element.id);
												setModal({});
											},
											onclick: () => setModal({}),
										});
									}}
								>
									Olvidar
								</button>
								{room.adminId == context.user_logged.id && (
									<button
										id={room.id}
										onClick={(event) => {
											let element = event.currentTarget;
											setModal({
												visible: true,
												message:
													"¿Deseas eliminar la sala? Esta acción es irreversible",
												confirm: true,
												onaccept: () => {
													deleteRoom(element.id);
													setModal({});
												},
												onclick: () => setModal({}),
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
			{modal.visible && (
				<Modal
					onclick={modal.onclick}
					message={modal.message}
					confirm={modal.confirm}
					onaccept={modal.onaccept}
				/>
			)}
		</>
	);
};

export default RoomPicker;
