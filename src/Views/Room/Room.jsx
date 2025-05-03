import React, { useContext, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import Classification from "../../Components/ClassificationView/Classification";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";
import { useNavigate } from "react-router-dom";
import useValidateToken from "../../utils/useValidateToken";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import config from "../../config/config";


const Room = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();
	useEffect(() => {
		if (!context.current_room?.current) {
			useNavigateWithCallback(navigate, "/app");
		}
		
	}, []);
	useEffect(() => {
		if (context.user_logged?.email == null && !window.location.href.includes(config.confirmemailLink)) {
			useNavigateWithCallback(navigate, "/missing-email");
		}
	}, [])
	
	useEffect(() => {
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
		validateUserToken();
	}, []);


	return (
		<>
			{context.user_logged.countries?.length == 5 &&
				context.current_room != undefined &&
				context.current_room?.current != undefined && (
					<div className="container">
						<Classification
							room={context.current_room?.current}
							animate={true}
						/>
					</div>
				)}
		</>
	);
};

export default Room;