import axios from "axios";

function useUpdateToken(user, context) {
	const token = `${Date.now()}`;
	const data = {
		token: token,
	};
	axios
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
