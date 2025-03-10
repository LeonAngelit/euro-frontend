import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Navigation from "./Components/Navigation/Navigation";
import PropTypes from "prop-types";
import axios from "axios";
import AppContext from "./Storage/AppContext";
import config from "./config/config"
import useGetAuthToken from "./utils/useGetAuthToken.js";
import useNavigateWithCallback from "./utils/useNavigateWithCallback.js";
import useUpdateuserData from "./utils/useUpdateUserData.js"



function Layout({ children }) {
	const d = new Date();
	const context = useContext(AppContext);
	const intervalRef = useRef(null);
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

	function updateRoomData(roomId) {
		axios
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
		useGetAuthToken(context);
		if (!context.user_logged?.token) {
			if (window.location.pathname == "/join-room") {
				useNavigateWithCallback(navigate, "/login?callback_url=" + window.location.href);
			} else {
				useNavigateWithCallback(navigate, "/login");
			}
		}
		else if (context.user_logged?.countries?.length < 5) {
			context.setCurrentRoom(() => ({
			}));
			if (window.location.pathname == "/join-room") {
				useNavigateWithCallback(navigate, "/country-select?callback_url=" + window.location.href);
			} else {
				useNavigateWithCallback(navigate, "/country-select");
			}
		} else {
			if (window.location.href.includes("callback_url=") && window.location.href.includes(config.joinRoomLink)) {
				window.location.href = window.location.href.split("callback_url=")[1];
			}

			if (window.location.pathname == "/join-room") {
				handleJoinRoomLink();
			}
		}

	}, [context.user_logged]);

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
							userId: context.user_logged.id,
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

	return (
		<>
			<Navigation />
			{children}
			<Footer />
		</>
	);
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Layout;
