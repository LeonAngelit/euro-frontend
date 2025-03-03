import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../Storage/AppContext";
import { useNavigate } from "react-router-dom";

import CountryPicker from "../../Components/CountryPicker/CountryPicker";

const CountrySelect = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();


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

	


	return (
		<>
			{(context.user_logged.countries?.length < 5 ||
				context.user_logged.countries == undefined) &&
				context.songs && (
					<div className="container">
						<CountryPicker  modal />
					</div>
				)}
		</>
	);
};

export default CountrySelect;
