import axios from "axios";
import config from "../config/config";

async function getSongs(xToken) {
  try {
    const response = await axios.get(`${config.baseUrl}countries`, {
      headers: {
        Accept: "application/json",
        Bearer: xToken,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

export default getSongs;

