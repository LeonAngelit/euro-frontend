import { useContext, useEffect } from "react";
import Footer from "./Components/Footer/Footer";
import Navigation from "./Components/Navigation/Navigation";
import PropTypes from "prop-types";
import axios from "axios";
import bcrypt from "bcryptjs";
import AppContext from "./Storage/AppContext";
import config from "./config/config"

 

function Layout({ children }) {
	const d = new Date();
	const context = useContext(AppContext);

	async function sendTokenRequest() {
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
				}
			})
			.catch((error) => {
				return error.response.data.message;
			});
	}

	async function updatePointRequest() {
		await axios
			.get(
				`${config.baseUrl}countries/refresh/${d.getFullYear()}`,
				{
					headers: {
						Accept: "application/json",
						Bearer: context.x_token,
					},
				}
			)
			.then((response) => {
				if (response.status == 200) {
					return response.data;
				}
			})
			.catch((error) => {
				return error.response.data.message;
			});
	}

	useEffect(() => {
		sendTokenRequest();
		setInterval(() => sendTokenRequest(), 1200000);
	}, []);

	useEffect(() => {
		let interval;
		if (
			context.x_token &&
			context.user_logged?.username == config.appAdmin
		) {
			interval = setInterval(() => {
				updatePointRequest();
			}, 40000);
		} else {
			clearInterval(interval);
		}
	}, [context.user_logged.username]);

	return (
		<>
			<Navigation />
			{children}
			<Footer />
		</>
	);
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Layout;
