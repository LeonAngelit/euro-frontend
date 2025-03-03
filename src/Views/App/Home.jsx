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
import updateUserData from "../../utils/useUpdateUserData";
import Collapsible from "../../Components/Collapsible/Collapsible";
import config from "../../config/config";


const Home = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();
	const [songs, setSongs] = useState(false);
	const passwordRef = useRef(null);
	const roomNameRef = useRef(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!context.user_logged?.token) {
			navigate("/login");
		}
	}, [context]);
	useEffect(() => {
		let interval = setInterval(() => {
			if (!useValidateToken(context.user_logged?.token)) {
				useHandleCloseSession(context);
				clearInterval(interval);
			}
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
		if (context.user_logged?.countries?.length < 5) {
			context.setCurrentRoom(() => ({
				
			}));
			navigate("/country-select");
		}

		if(context.current_room?.current){
			navigate("/room");
		}
	}, []);

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
		axios
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
							userId: context.user_logged.id,
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
		axios
			.post(`${config.baseUrl}rooms/add-user`, data, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 201) {
					updateUserData(context, navigate);
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
		const songs = await useGetSongs(context);
		setSongs(songs);
	}

	return (
		<>
			<div className="container">
				{context.user_logged.countries?.length == 5 &&
					!context.current_room?.current && (

						<div className="rooms-options">
							<p>Selecciona una sala de tu lista:</p>
							<RoomPicker rooms={context.user_logged?.rooms} />
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
