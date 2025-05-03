import axios from "axios";
import config from "../config/config";
import bcrypt from "bcryptjs";

async function useGetAuthToken(context) {
    try {
        const salt = bcrypt.genSaltSync(12);
        const token = bcrypt.hashSync(config.authP, salt, null);

        const response = await axios.get(`${config.baseUrl}getAuthToken`, {
            headers: {
                Accept: "application/json",
                Authorization: `${token}`,
            },
        });

        if (response.status === 200) {
            context.setXtoken(response.data);
            return response.data;
        }

    } catch (error) {
        console.error("Auth token error:", error.response?.data?.message || error.message);
        return null;
    }
}
export default useGetAuthToken;