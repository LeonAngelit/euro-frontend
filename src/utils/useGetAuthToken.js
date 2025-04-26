import axios from "axios";
import config from "../config/config";
import bcrypt from "bcryptjs";

async function useGetAuthToken(context) {
    const salt = bcrypt.genSaltSync(12);
    const token = bcrypt.hashSync(config.authP, salt, null);
    await axios
        .get(`${config.baseUrl}getAuthToken`, {
            headers: {
                Accept: "application/json",
                Authorization: `${token}`,
            },
        })
        .then((response) => {
            if (response.status == 200) {
                context.setXtoken(`${response.data}`);
                return response.data;
            }
        })
        .catch((error) => {
            return error.response.data.message;
        });
}

export default useGetAuthToken;