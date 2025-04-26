import axios from "axios";
import config from "../config/config";

async function useValidateEmail(context, argToken) {
	let responseReturn = {}
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
				responseReturn = {
					result: true,
					data: response.data.id
				}

			} else {
				responseReturn = {
					result: false,
					data: response
				}
			}
		})
		.catch((error) => {
			responseReturn = {
				result: false,
				data: error.response.data.message
			}
		});
	return responseReturn;
}

export default useValidateEmail;
