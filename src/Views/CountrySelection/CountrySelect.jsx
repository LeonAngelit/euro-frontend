import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../Storage/AppContext";
import CountryPicker from "../../Components/CountryPicker/CountryPicker";
import { useNavigate } from "react-router-dom";
import useValidateToken from "../../utils/useValidateToken"
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";
import config from "../../config/config";

const CountrySelect = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();

	useEffect(() => {
		let interval = setInterval(() => {
			if (!useValidateToken(context.user_logged?.token)) {
				useHandleCloseSession(context);
				clearInterval(interval);
			}
		}, 3600000);
	}, []);


	useEffect(() => {
		if (context.user_logged?.countries?.length >= 5) {
			if (window.location.href.includes("callback_url=") && window.location.href.includes(config.joinRoomLink)) {
				window.location.href=window.location.href.split("callback_url=")[1];
			} else {
				useNavigateWithCallback(navigate, "/app");
			}
		}
	}, [context.user_logged]);

	return (
		<>
			<div className="container">
				{(context.user_logged.countries?.length < 5 ||
					context.user_logged.countries == undefined) &&
					(
						<CountryPicker modal />
					)}
			</div>
		</>
	);
};

export default CountrySelect;
