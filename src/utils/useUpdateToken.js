import axios from "axios";

function useUpdateToken(user, context) {
  const token = `${Date.now()}`;
  const data = {
    token: token,
  };
  axios
    .put(
      `${process.env.REACT_APP_BASEURL}/api/eurocontest/users/${user.id}`,
      data,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${context.x_token}`,
        },
      }
    )
    .then(() => {
      context.setUserLogged((user) => ({
        ...user,
        token: data.token,
      }));
    });
}

export default useUpdateToken;
