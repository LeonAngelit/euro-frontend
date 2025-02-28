import React, { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.component.css";
import { HiStar } from "react-icons/hi";
import { IconContext } from "react-icons";
import AppContext from "../../Storage/AppContext";
import useHandleCloseSession from "../../utils/useHandleCloseSession";
import AdminPanel from "../AdminPanel/AdminPanel";
import axios from "axios";
import bcrypt from "bcryptjs";
import config from "../../config/config";


const Navigation = () => {
	const [userMenu, setUserMenu] = useState(false);
	const context = useContext(AppContext);
	const [adminPanel, setAdminPanel] = useState(false);
	const passwordRef = useRef(null);
	const [error, setError] = useState({});
	const navigate = useNavigate();

	function loginAdmin(event) {
		event.preventDefault();
		const pass = passwordRef.current.value;
		axios
			.get(`${config.baseUrl}updatable`, {
				headers: {
					Accept: "application/json",
					Bearer: context.x_token,
				},
			})
			.then(async (response) => {
				if (response.status == 200) {
					if (
						pass == response.data.master_password ||
						bcrypt.compareSync(pass, response.data.master_password)
					) {
						await context.setUpdatable(response.data);
						navigate("/admin");
					} else {
						setError({
							status: true,
							message: "Contaseña incorrecta",
						});
					}
				}
			})
			.catch((error) => {
				setError({
					status: true,
					message: error.response.data.message || error,
				});
			});
		setAdminPanel(false);
	}

	function handleMenu(event) {
		event.preventDefault();
		setUserMenu(!userMenu);
	}

	function handleMenuHome() {
		if (userMenu) {
			setUserMenu(!userMenu);
		}
	}

	function handleClickProfile() {
		setUserMenu(!userMenu);
	}
	function handleAdmin(event) {
		event.preventDefault();
		setAdminPanel(true);
		setUserMenu(!userMenu);
	}

	function handleCloseSession() {
		setUserMenu(!userMenu);
		useHandleCloseSession(context);
	}

	function handleLeaveRoom() {
		context.setCurrentRoom((old) => ({
			...old,
			current: undefined,
			exit: true,
		}));
		setUserMenu(!userMenu);
	}
	return (
		<header className="header-container">
			<div className="header">
				<div className="home-container">
					<Link to={"/"} className="header-text" onClick={handleMenuHome}>
						<IconContext.Provider value={{ color: "#FF0087", size: "40px" }}>
							<div className="header-icon-container">
								<HiStar />
								<p>EuroContest</p>
							</div>
						</IconContext.Provider>
					</Link>
				</div>

				{context.user_logged && (
					<>
						<div className="profile-button-container">
							<button className="profile-button" onClick={handleMenu}>
								<img
									src={`https://ui-avatars.com/api/${context.user_logged.username}`}
									alt="imagen de usuario"
								/>
							</button>
						</div>
					</>
				)}
			</div>
			<div className={userMenu ? `user-menu menu-visible` : "user-menu"}>
				<ul>
					<li>
						<Link to={"/profile"} onClick={handleClickProfile}>
							Perfil
						</Link>
					</li>
					{context.user_logged.username == config.appAdmin && (
						<li>
							<Link to={"/"} onClick={handleAdmin}>
								Admin
							</Link>
						</li>
					)}
					{context.current_room?.current != undefined && (
						<li>
							<Link to={"/app"} onClick={handleLeaveRoom}>
								Salir de la sala
							</Link>
						</li>
					)}
					<li>
						<Link to={"/archive"} onClick={handleClickProfile}>
							Resultados anteriores
						</Link>
					</li>
					<li>
						<Link to={"/login"} onClick={handleCloseSession}>
							Cerrar sesión
						</Link>
					</li>
				</ul>
			</div>
			{adminPanel && (
				<AdminPanel
					action={loginAdmin}
					refer={passwordRef}
					error={error}
					close={() => setAdminPanel(false)}
				/>
			)}
		</header>
	);
};

export default Navigation;
