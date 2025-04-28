import axios from "axios";
import config from "../config/config";

async function useValidateToken(context) {
  const response = await axios.get(`${config.baseUrl}users/validateToken/${context.user_logged?.id}`, {
    headers: {
      Accept: "application/json",
      Bearer: context.x_token,
    },
  }).then((response) => {
    return response;
  }).catch((error) => {
    return false
  })
  if (response.status == 200) {
    return response.data.isValidToken;
  } else {
    return false;
  }
}

export default useValidateToken;
