import { useContext, useEffect, useRef} from "react";
import Footer from "./Components/Footer/Footer";
import Navigation from "./Components/Navigation/Navigation";
import PropTypes from "prop-types";
import axios from "axios";
import AppContext from "./Storage/AppContext";
import config from "./config/config"
import useGetAuthToken from "./utils/useGetAuthToken.js";

 

function Layout({ children }) {
	const d = new Date();
	const context = useContext(AppContext);
	const intervalRef = useRef(null);

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
				} else if(response.status == 401) {
					 useGetAuthToken(context);
					 updatePointRequest();
				}
			})
			.catch((error) => {
				return error.response.data.message;
			});
	}

	useEffect(() => {
		useGetAuthToken(context);
		setInterval(() => useGetAuthToken(context), 1200000);
	}, []);

	
	useEffect(() => {
		
		if (
			context.x_token &&
			context.user_logged?.username === config.appAdmin &&
			context.updatable?.refresh_enabled
		) {
			intervalRef.current = setInterval(() => {
				updatePointRequest();
			}, 40000);
		} else {
			clearInterval(intervalRef.current);
				intervalRef.current = null;
		}
	}, [context.updatable, context.x_token, context.user_logged]);
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
