import axios from "axios";
import config from "../config/config";

async function useValidateEmail(context, argToken) {
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
				{

					return {
						response: true,
					}
				}
			} else {
				{

					return {
						response: false,
					}
				}
			}
		})
		.catch((error) => {
			return {
				response: false,
				message: error.response.data.message
			}
		});
}

export default useValidateEmail;
