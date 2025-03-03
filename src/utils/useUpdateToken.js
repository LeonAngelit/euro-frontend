import axios from "axios";
import config from "../config/config";

async function useUpdateToken(user, context) {
	const token = `${Date.now()}`;
	const data = {
		token: token,
	};
	await axios
		.put(`${config.baseUrl}users/${user.id}`, data, {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${context.x_token}`,
			},
		})
		.then(() => {
			context.setUserLogged((user) => ({
				...user,
				token: data.token,
			}));
		});
}

export default useUpdateToken;
