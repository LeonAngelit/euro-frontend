import React, { useContext, useEffect, useState } from "react";
import "./Home.Component.css";
import AppContext from "../../Storage/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Classification from "../../Components/ClassificationView/Classification";
window.Buffer = window.Buffer || require("buffer").Buffer;

const Archive = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();
	const [historicalRooms, setHistoricalRooms] = useState(false);
	const [selectedHistoricalRoom, setSelectedHistoricalRoom] = useState(false);

	useEffect(() => {
		if (!context.user_logged?.token) {
			navigate("/login");
		}
	}, [context]);

	useEffect(() => {
		fetchRooms();
	}, []);


	function setSelectedRoom(roomId) {
		axios
			.get(`${config.baseUrl}archive/${roomId}`, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then((response) => {
				if (response.status == 200) {
					setSelectedHistoricalRoom(response.data);
				}
			})
			.catch((error) => {
				if (error.response.status == 404) {
					return {
						status: true,
						message: "No se han encontrado datos",
					};
				} else {
					return {
						status: true,
						message: error.response.data.message,
					};
				}
			});
	}

	function fetchRooms(){
		axios
		.get(`${config.baseUrl}archive/${context.user_logged?.username}`, {
			headers: {
				Accept: "application/json",
				Bearer: context.x_token,
			},
		})
		.then((response) => {
			if (response.status == 200) {
				setHistoricalRooms(response.data);
			}
		})
		.catch((error) => {
			if (error.response.status == 404) {
				return {
					status: true,
					message: "No se han encontrado datos",
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
			

			{selectedHistoricalRoom && (
					<div className="container">
						<Classification
							room={selectedHistoricalRoom}
						/>
					</div>
				)}
		</>
	);
};

export default Archive;
