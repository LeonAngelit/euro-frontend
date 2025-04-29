import React, { useContext, useEffect, useState, useRef } from "react";
import "./Home.Component.css";
import AppContext from "../../Storage/AppContext";
import { Link, useNavigate } from "react-router-dom";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import useValidateToken from "../../utils/useValidateToken";
import useGetSongs from "../../utils/useGetSongs";
import { validateRegex, validateUserNameRegex } from "../../utils/regexUtils";
import bcrypt from "bcryptjs";
import axios from "axios";
import Form from "../../Components/Form/Form";
import RoomPicker from "../../Components/RoomPicker/RoomPicker";
import useUpdateUserData from "../../utils/useUpdateUserData";
import Collapsible from "../../Components/Collapsible/Collapsible";
import config from "../../config/config";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";


const Home = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();
	const [songs, setSongs] = useState(context.songs);
	const passwordRef = useRef(null);
	const roomNameRef = useRef(null);
	const [error, setError] = useState(false);
	const [rooms, setRooms] = useState(context.user_logged?.rooms)


	useEffect(() => {
		if (context.current_room?.current) {
			useNavigateWithCallback(navigate, "/room");
		}
	}, [])
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
	

	useEffect(() => {	
		validateUserToken();
		if (context.user_logged?.email == null) {
			useNavigateWithCallback(navigate, "/missing-email");
		} else if (context.user_logged?.countries?.length < 5) {
			context.setCurrentRoom(() => ({
			}));
			if (window.location.pathname == "/join-room" || window.location.href.includes(config.confirmemailLink)) {
				useNavigateWithCallback(navigate, "/country-select?callback_url=" + window.location.href);
			} else {
				useNavigateWithCallback(navigate, "/country-select");
			}
		} else {
			if (window.location.href.includes("callback_url")) {
				const url = window.location.href.split("callback_url=")[1];
				navigate(url);
			}

			if (window.location.pathname == "/join-room") {
				handleJoinRoomLink();
			}
		}

	}, []);

	useEffect(() => {
		let interval = setInterval(() => {
			(async () => {
				if (!await useValidateToken(context)) {
					clearInterval(interval);
					useHandleCloseSession(context);
				}
			})();
		}, 3600000);
	}, []);
	useEffect(() => {
		if (context.x_token) {
			initializeSongs();
		}
	}, []);
	useEffect(() => {
		context.setSongs(songs);
	}, [songs]);

	useEffect(() => {
		setRooms(context.user_logged?.rooms)
	}, [context.user_logged])


	async function joinRoom(event) {
		event.preventDefault();
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
		await axios
			.get(
				`${config.baseUrl}rooms/name/${roomNameRef.current.value}`,
				{
					headers: {
						Accept: "application/json",
						Bearer: context.x_token,
					},
				}
			)
			.then((response) => {
				if (response.status == 200) {
					if (
						bcrypt.compareSync(
							passwordRef.current.value,
							response.data.password
						)
					) {
						addUserRoom({
							userId: context.user_logged?.id,
							roomId: response.data.id,
						});
					} else {
						setError({
							status: true,
							message: "Contaseña incorrecta",
						});
					}
				}
				setError(false);
				event.target.reset();
			})
			.catch((error) => {
				if (error.response.status == 404) {
					setError({
						status: true,
						message: "Sala no encontrada, prueba con otro ID",
					});
				} else {
					setError({
						status: true,
						message: error.response.data.message,
					});
				}
			});
	}

	async function addUserRoom(data) {
		await axios
			.post(`${config.baseUrl}rooms/add-user`, data, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 201) {
					useUpdateUserData(context, navigate);
				}
			})
			.catch((error) => {
				if (error.response.status == 404) {
					setError({
						status: true,
						message: "Sala no encontrada, prueba con otro ID",
					});
				} else {
					setError({
						status: true,
						message: error.response.data.message,
					});
				}
			});
	}

	async function initializeSongs() {
		if (!songs) {
			const songs = await useGetSongs(context);
			setSongs(songs);
		}
	}

	return (
		<>
			<div className="container">
				{context.user_logged.countries?.length == 5 &&
					!context.current_room?.current && (

						<div className="rooms-options">
							<p>Selecciona una sala de tu lista:</p>
							<RoomPicker rooms={rooms} />
							<Collapsible title={"Unirte a una sala: "}>
								<Form
									action={joinRoom}
									error={error}
									submitValue="Unirme"
									showPassword={true}
									fields={[
										{
											name: "roomname",
											placeholder: "ID de la sala",
											type: "text",
											ref: roomNameRef,
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
										Únete o <Link to={"/createroom"}>Crea una sala</Link>
									</p>
								</div>
							</Collapsible>
						</div>

					)}

			</div>
		</>
	);
};

export default Home;
