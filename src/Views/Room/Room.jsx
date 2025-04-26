import React, { useContext, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import Classification from "../../Components/ClassificationView/Classification";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";
import { useNavigate } from "react-router-dom";
import useValidateToken from "../../utils/useValidateToken";
import useHandleCloseSession from "../../utils/useHandleCloseSession";


const Room = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();
	useEffect(() => {
		if (!context.current_room?.current) {
			useNavigateWithCallback(navigate, "/app");
		}
		
	}, []);
	useEffect(() => {
		if (!useValidateToken(context.user_logged?.token)) {
			useHandleCloseSession(context);
		}
	}, []);
	useEffect(() => {
		if (!context.user_logged?.email && !window.location.href.includes(config.confirmemailLink)) {
			useNavigateWithCallback(navigate,"/missing-email");
		}
	}, [])


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