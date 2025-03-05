
async function useNavigateWithCallback(navigate, destination) {
	let callbackUrl = ""
	if (window.location.href.includes("callback_url")) {
		callbackUrl = "?callback_url=" + window.location.href.split("callback_url=")[1];
	}
	navigate(destination + callbackUrl);
}

export default useNavigateWithCallback;
