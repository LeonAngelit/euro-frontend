async function useValidateEmail(argToken) {
  if(!argToken){
    return false;
  }
  await axios
		.post(`${config.baseUrl}/users/updateUserEmail`,{token: argToken}, {
			headers: {
				Accept: "application/json",
				bearer: `${context.x_token}`,
			},
		})
		.then((response) => {
			if (response.status == 200) {
				{
					context.setUserLogged(response.data);
				}
			}
		})
		.then(() => {
			navigate("/app");
		})
		.catch((error) => {
			return error.response.data.message;
		});
}

export default useValidateEmail;
