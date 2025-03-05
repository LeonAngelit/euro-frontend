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
					if(!RoomIntervalRef.current){
						RoomIntervalRef.current = setInterval(() => {
							updateRoomData(context.current_room?.current?.id);
						}, 60000);
					}
					
			}else {
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

		if (!context.user_logged?.token) {
			useNavigateWithCallback(navigate, "/login");
		}
		if (context.user_logged?.countries?.length < 5) {
			context.setCurrentRoom(() => ({

			}));
			useNavigateWithCallback(navigate,"/country-select");
		}

	}, [context]);

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
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, [context.updatable, context.x_token, context.user_logged]);
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
