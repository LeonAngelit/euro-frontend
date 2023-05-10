import axios from "axios";

async function updateUserData(context, navigate) {
  axios
    .get(
      `${process.env.REACT_APP_BASEURL}/api/eurocontest/users/${context.user_logged.id}`,
      {
        headers: {
          Accept: "application/json",
          Bearer: context.x_token,
        },
      }
    )
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

export default updateUserData;
