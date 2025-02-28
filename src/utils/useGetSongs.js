import axios from "axios";
import config from "../config/config";

async function useGetSongs(context) {
	try {
		const response = await axios.get(
			`${config.baseUrl}countries`,
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
