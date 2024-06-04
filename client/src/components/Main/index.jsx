// src/components/Main.js

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";




const Main = () => {
    const [user, setUser] = useState({});
    const [lastLogin, setLastLogin] = useState("");
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [localTime, setLocalTime] = useState("");
    const [error, setError] = useState("");
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [timeOfDay, setTimeOfDay] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // const url = "http://localhost:8080/api/users/me";
                const url = `${process.env.REACT_APP_BACKEND_URL}/api/users/me`;

                const { data } = await axios.get(url, {
                    headers: { "x-auth-token": localStorage.getItem("token") }
                });
                setUser(data.user);
                setLastLogin(data.lastLogin);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    const determineTimeOfDay = (hour) => {
        if (hour >= 5 && hour < 12) {
            setTimeOfDay("morning");
        } else if (hour >= 12 && hour < 16) {
            setTimeOfDay("afternoon");
        } else if (hour >= 16 && hour < 19) {
            setTimeOfDay("evening");
        } else {
            setTimeOfDay("night");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const getWeatherReport = async (city) => {
        try {
            setError(""); // Reset error message
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=eb7a2d4a5a9b284fe54b7bb547238443&units=metric`
            );
            if (!weatherResponse.ok) {
                throw new Error("City not found");
            }
            const weatherData = await weatherResponse.json();
            setWeatherData(weatherData);

            // Calculate local time
           // Calculate local time
			const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
			const localTime = new Date(utcTime + (weatherData.timezone * 1000));
			setLocalTime(localTime.toLocaleString());
            determineTimeOfDay(localTime.getHours());

            setShowMoreInfo(false);
        } catch (error) {
            setError("Enter a valid city name");
            setWeatherData(null); // Reset weather data
        }
    };

    const handleToggleMoreInfo = () => {
        setShowMoreInfo(!showMoreInfo);
    };

    const handleSearch = () => {
        if (city) {
            getWeatherReport(city);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className={styles.main_container}>

            <nav className={styles.navbar}>
                <h1>Welcome, {user.firstName} {user.lastName}</h1>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            <div className={styles.red_background}>

            <div className={styles.user_info}>
                <h3>Email: {user.email}</h3>
                <h3>Last Login: {lastLogin ? new Date(lastLogin).toLocaleString() : "N/A"}</h3>
            </div>
            <div className={styles.search_container}>
                <input
                    type="text"
                    placeholder="Type a City Name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={styles.input_box}
                />
                <button onClick={handleSearch} className={styles.search_btn}>
                    🔍
                </button>
            </div>
            {error && <p className={styles.error_message}>{error}</p>}
            {weatherData && (
                <div className={`${styles.weather_card} ${styles[timeOfDay]}`}>
                    <div className={styles.card_title}>
                        <h2>{weatherData.name}</h2>
                        <h4>{localTime}</h4>
                    </div>
                    <div className={styles.card_body}>
                        <h6 className={styles.temp}>{Math.round(weatherData.main.temp)}°C</h6>
                        <h5 className={styles.feel}>(Feels Like {Math.round(weatherData.main.feels_like)}°C)</h5>
                        <h5 className={styles.weather}>{weatherData.weather[0].main}</h5>
                        <h5 className={styles.minmax_temp}>
                            {Math.floor(weatherData.main.temp_min)}°C(min) / {Math.ceil(weatherData.main.temp_max)}°C(max)
                        </h5>
                    </div>
                    <div className={styles.accordion} id="accordionExample">
                        <div className={styles.accordion_item}>
                            <h2 className={styles.accordion_header} id="headingOne">
                                <button
                                    className={`${styles.accordion_button} ${showMoreInfo ? '' : styles.collapsed}`}
                                    type="button"
                                    onClick={handleToggleMoreInfo}
                                >
                                    <strong>More Information</strong>
                                </button>
                            </h2>
                            {showMoreInfo && (
                                <div className={styles.accordion_collapse}>
                                    <div className={styles.accordion_body}>
                                        <ul className={styles.list_group}>
                                            <li className={styles.list_group_item}>
                                                <span><strong>Humidity</strong></span> {weatherData.main.humidity}%
                                            </li>
                                            <li className={styles.list_group_item}>
                                                <span><strong>Pressure</strong></span> {weatherData.main.pressure} hPa
                                            </li>
                                            <li className={styles.list_group_item}>
                                                <span><strong>Wind Speed</strong></span> {weatherData.wind.speed} m/s
                                            </li>
                                            <li className={styles.list_group_item}>
                                                <span><strong>Wind Direction</strong></span> {weatherData.wind.deg}°
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Main;
