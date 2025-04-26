import axios from "axios";
import config from "../config/config";

async function useValidateEmail(context, argToken) {
	let response = {}
	if (!argToken) {
		return false;
	}
	await axios
		.post(`${config.baseUrl}users/updateUserEmail`, { token: argToken }, {
			headers: {
				Accept: "application/json",
				bearer: `${context.x_token}`,
			},
		})
		.then((response) => {
			if (response.status == 200) {
				response = {
					response: true,
					data: response.data.id
				}

			} else {
				response = {
					response: false,
				}
			}
		})
		.catch((error) => {
			response = {
				response: false,
				message: error.response.data.message
			}
		});

	return response;
}

export default useValidateEmail;
