import { React, useState, useContext, useEffect } from "react";
import "./CountryPicker.Component.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Modal from "../Modal/Modal";
import { Link } from "react-router-dom";
import { GiPlayButton } from "react-icons/gi";
import { IconContext } from "react-icons";
import AppContext from "../../Storage/AppContext";
import axios from "axios";
import config from "../../config/config";
import useGetSongs from "../../utils/useGetSongs";
const CountryPicker = () => {
	const [modal, setModal] = useState({});
	const [continuar, setContinuar] = useState(false);
	const [songs, setSongs] = useState(false);

	const context = useContext(AppContext);
	useEffect(() => {
		setContinuar(context.selection.current.length == 5);
	}, []);

	async function handleContinue() {
		if (context.selection.current.length == 5) {
			const data = {
				userId: context.user_logged.id,
				selection: context.selection.current,
			};
			axios
				.post(`${config.baseUrl}users/bulk/add-country`, data, {
					headers: {
						Accept: "application/json",
						Bearer: context.x_token,
					},
				})
				.then((response) => {
					if (response.status == 201) {
						setModal({
							visible: true,
							message: "Actualización correcta",
							status: "success",
							confirm: setModal({}),
						});
						setTimeout(() => {
							setModal({});
						}, 3000);
						context.setUserLogged((user) => ({
							...user,
							countries: context.selection.current,
						}));
					}
				})
				.catch((error) => {
					setModal({
						visible: true,
						message: error.response.data.message,
						status: "error",
						confirm: setModal({}),
					});
					setTimeout(() => {
						setModal({});
					}, 3000);

					return error;
				});
		} else {
			setModal({
				visible: true,
				message: "Tienes que elegir 5 países",
				status: "error",
				confirm: setModal({}),
			});
			setTimeout(() => {
				setModal({});
			}, 3000);
		}
	}

	function validateSelection() {
		let elements = Array.from(document.getElementsByTagName("input"));
		if (context.selection.current.length == 5) {
			setContinuar(true);
			elements.map((element) => {
				if (!element.checked) {
					element.disabled = true;
					element.parentElement.parentElement.classList.add("disabled");
				}
			});
			return false;
		}
		setContinuar(false);
		elements.map((element) => {
			element.disabled = false;
			element.parentElement.parentElement.classList.remove("disabled");
		});
		return true;
	}

	function handleSelect(event) {
		let selectedCountriesTemp = context.selection.current;
		if (event.target.checked) {
			if (validateSelection()) {
				selectedCountriesTemp.push(parseInt(event.target.id));
			} else {
				setModal({
					visible: true,
					message: "No puedes elegir más de 5 países",
					status: "error",
					confirm: setModal({}),
				});
				setTimeout(() => {
					setModal({});
				}, 3000);
			}
		} else {
			selectedCountriesTemp.splice(
				selectedCountriesTemp.indexOf(parseInt(event.target.id)),
				1
			);
		}

		context.setSelection((selection) => ({
			...selection,
			current: selectedCountriesTemp,
		}));
		validateSelection();
	}

		useEffect(() => {
			if (context.x_token) {
				initializeSongs();
			}
		}, []);
	
		useEffect(() => {
			context.setSongs(songs);
		}, [songs]);
		
	
		async function initializeSongs() {
			const songs = await useGetSongs(context);
			setSongs(songs);
		}
	return (
		<>
			<div className="countries-container">
				<p>
					Selecciona 5 países de los siguientes, es importante que el primer
					país seleccionado sea el que creas que será el ganador, podrás
					comprobarlo porque aparecerá resaltado respecto a los demás.
				</p>
				<div className="selected-countries-container">
					<p>Países seleccionados: </p>
					<div className="selected-countries">
						{context.selection.current.map((country) => {
							return (
								<p
									key={context.selection.current.indexOf(country)}
									className={
										context.selection.current.indexOf(country) == 0
											? "winner-country"
											: ""
									}
								>
									{context.songs.find((element) => element.id == country).name}
								</p>
							);
						})}
					</div>
				</div>
				{continuar && (
					<div className="continue-container">
						<button type="button" onClick={handleContinue}>
							Continuar
						</button>
					</div>
				)}
				{context.songs && context.songs?.map((country) => {
					return (
						<article
							className={
								context.selection.current.includes(country.id)
									? "country-container country-selected-card"
									: "country-container"
							}
							key={context.songs?.indexOf(country)}
						>
							<label htmlFor={country.id}>
								<div className="country-info-container">
									<p>
										<span
											className={`fi fi-${country.code} fis country-flag`}
										></span>
										{country.name}
									</p>
									{country.link && <div className="song-link-container">
										<p className="song-container">
											{country.song.replace("amp;", "")}
										</p>
										<Link to={country.link} target="_blank" rel="noopener">
											<IconContext.Provider
												value={{ color: "rgb(255, 248, 0)", size: "20px" }}
											>
												<div className="header-icon-container">
													<GiPlayButton />
												</div>
											</IconContext.Provider>
										</Link>
									</div>}
								</div>
								<input
									type="checkbox"
									className="country-checkbox"
									onChange={handleSelect}
									name={country.name}
									defaultChecked={context.selection.current.includes(
										country.id
									)}
									id={country.id}
								/>
							</label>
						</article>
					);
				})}
			</div>

			{modal.visible && !modal.confirm && (
				<Modal
					message={modal.message}
					status={modal.status}
					onclick={() => setModal({})}
				/>
			)}
		</>
	);
};

export default CountryPicker;
