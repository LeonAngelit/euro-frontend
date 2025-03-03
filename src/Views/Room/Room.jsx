import React, { useContext, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Classification from "../../Components/ClassificationView/Classification";
import config from "../../config/config";
 

const Room = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();


	useEffect(() => {
		if (!context.user_logged?.token) {
			navigate("/login");
		}
		if(!context.current_room?.current){
			navigate("/app");
		}
	}, [context]);



	useEffect(() => {
		if (context.user_logged?.countries?.length < 5) {
			context.setCurrentRoom(() => ({
				
			}));
			navigate("/country-select");
		}
	}, [context.user_logged]);

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
					if (context.current_room.exit != true) {
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


	return (
		<>
			{context.user_logged.countries?.length == 5 &&
				context.current_room != undefined &&
				context.current_room?.current != undefined && (
					<div className="container">
						<Classification
							room={context.current_room?.current}
							updateRoomData={updateRoomData}
						/>
					</div>
				)}
		</>
	);
};

export default Room;