import axios from "axios";

async function useGetSongs(context) {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_BASEURL}countries`,
			{
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			}
		);
		if (response.status == 200) {
			return response.data;
		}
	} catch (error) {
		return error;
	}
}

export default useGetSongs;
