import React, { useContext, useEffect } from "react";
import AppContext from "../../Storage/AppContext";
import Classification from "../../Components/ClassificationView/Classification";
import useNavigateWithCallback from "../../utils/useNavigateWithCallback";
import { useNavigate } from "react-router-dom";


const Room = () => {
	const context = useContext(AppContext);
	const navigate = useNavigate();
	useEffect(() => {
		if (!context.current_room?.current) {
			useNavigateWithCallback(navigate, "/app");
		}
		
	}, []);


	return (
		<>
			{context.user_logged.countries?.length == 5 &&
				context.current_room != undefined &&
				context.current_room?.current != undefined && (
					<div className="container">
						<Classification
							room={context.current_room?.current}
						/>
					</div>
				)}
		</>
	);
};

export default Room;