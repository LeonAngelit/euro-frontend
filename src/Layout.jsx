import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Navigation from "./Components/Navigation/Navigation";
import PropTypes from "prop-types";
import axios from "axios";
import AppContext from "./Storage/AppContext";
import config from "./config/config"
import useGetAuthToken from "./utils/useGetAuthToken.js";
import useUpdateuserData from "./utils/useUpdateUserData.js"
import Modal from "./Components/Modal/Modal";
import useNavigateWithCallback from "./utils/useNavigateWithCallback.js";


function Layout({ children }) {
	const d = new Date();
	const context = useContext(AppContext);
	const intervalRef = useRef(null);
	const [modal, setModal] = useState({});
	const RoomIntervalRef = useRef(null);
	const navigate = useNavigate();
	async function updatePointRequest() {
		await axios
			.get(
				`${config.baseUrl}countries/refresh/${d.getFullYear()}`,
				{
					headers: {
						Accept: "application/json",
						Bearer: context.x_token,
					},
				}
			)
			.then((response) => {
				if (response.status == 200) {
					return response.data;
				} else if (response.status == 401) {
					useGetAuthToken(context);
					updatePointRequest();
				}
			})
			.catch((error) => {
				return error.response.data.message;
			});
	}
	useEffect(() => {
		if (context.x_token &&
			context.current_room?.current != undefined) {
			if (!RoomIntervalRef.current) {
				RoomIntervalRef.current = setInterval(() => {
					updateRoomData(context.current_room?.current?.id);
				}, 60000);
			}

		} else {
			clearInterval(RoomIntervalRef.current);
			RoomIntervalRef.current = null;
		}

	}, [context.current_room]);

	async function updateRoomData(roomId) {
		await axios
			.get(`${config.baseUrl}rooms/${roomId}`, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 200) {
					if (context.current_room.current) {
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
				}
			})
			.catch((error) => {
				if (error.response.status == 404) {
					return {
						status: true,
						message: "Sala no encontrada",
					};
				} else {
					return {
						status: true,
						message: error.response.data.message,
					};
				}
			});
	}

	useEffect(() => {
		async function getToken() {
			await useGetAuthToken(context);
		}
		getToken();
		if (context.user_logged && context.user_logged?.email != null && context.user_logged?.countries?.length == 5 && window.location.pathname == "/join-room") {
			handleJoinRoomLink();
		}
		if(!context.user_logged){
			if (window.location.href.includes("/join-room") || window.location.href.includes(config.confirmemailLink)) {
				useNavigateWithCallback(navigate, "/login?callback_url=" + window.location.href);
			} else {
				useNavigateWithCallback(navigate, "/login");
			}
		}
	
	}, [context.user_logged]);

	async function handleJoinRoomLink() {
		if (window.location.href.includes("roomAuth")) {
			const roomAuth = window.location.href.split("roomAuth=")[1];
			await axios.post(`${config.baseUrl}rooms/verifyRoomToken`, { token: roomAuth }, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
				.then((response) => {
					if (response.status == 200) {
						addUserRoom({
							userId: context.user_logged?.id,
							roomId: response.data.id,
						});
					}
				})
				.catch(async (error) => {
					if (error.response.status == 401) {
						await useGetAuthToken(context);
						handleJoinRoomLink();
					}
					navigate("/app");
				});
		}
	}

	useEffect(() => {
		useGetAuthToken(context);
		setInterval(() => useGetAuthToken(context), 1200000);
	}, []);


	useEffect(() => {
		if (
			context.x_token &&
			context.user_logged?.username === config.appAdmin &&
			context.updatable?.refresh_enabled
		) {
			intervalRef.current = setInterval(() => {
				updatePointRequest();
			}, 40000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}

		}
	}, [context.user_logged]);

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
					useUpdateuserData(context, navigate);
				}
			})
			.catch(() => {
				navigate("/app");
			});
	}

	return (
		<>
			<Navigation />
			{children}
			{modal.visible && !modal.confirm && (
				<Modal
					message={modal.message}
					status={modal.status}
					onclick={() => setModal({})}
				/>
			)}
			<Footer />
		</>
	);
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Layout;
