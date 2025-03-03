import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../Storage/AppContext";
import { useNavigate } from "react-router-dom";
import useGetSongs from "../../utils/useGetSongs";
import CountryPicker from "../../Components/CountryPicker/CountryPicker";

const CountrySelect = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();
	const [songs, setSongs] = useState(false);

	useEffect(() => {
		if (!context.user_logged?.token) {
			navigate("/login");
		}
		if(context.user_logged?.countries?.length >= 5){
			navigate("/home");
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
	

	async function initializeSongs() {
		const songs = await useGetSongs(context);
		setSongs(songs);
	}

	return (
		<>
			{(context.user_logged.countries?.length < 5 ||
				context.user_logged.countries == undefined) &&
				context.songs && (
					<div className="container">
						<CountryPicker countries={context.songs} modal />
					</div>
				)}
		</>
	);
};

export default CountrySelect;
