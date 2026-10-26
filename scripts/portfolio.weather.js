"use strict";

// API configuration
const latitude = 52.0767;
const longitude = 4.7175;

const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;


/**
 * Retrieves current weather information using the Fetch API.
 */
async function getWeatherData() {

    // Check whether weather information is cached
    try {
        const cached = localStorage.getItem(CACHE_KEY);

        if (cached) {

            const parsed = JSON.parse(cached);

            if (
                Date.now() - parsed.timestamp < CACHE_DURATION
            ) {
                return parsed.weather;
            }
        }
    } catch (error) {
        console.warn("Weather cache unavailable:", error);
    }

    // If no valid cache exists, fetch new information
    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (!data.current) {
            throw new Error("Invalid weather API response");
        }

        try {
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                    timestamp: Date.now(),
                    weather: data.current
                })
            );
        } catch (error) {
            console.warn("Unable to cache weather:", error);
        }

        return data.current;

    } catch (error) {

        console.error("Error fetching weather data:", error);

        throw error;
    }
}


/**
 * Converts weather codes into readable descriptions.
 */
function getWeatherDescription(code) {

    if (code === 0) return "Clear sky";

    if (code >= 1 && code <= 3) return "Cloudy";

    if (code === 45 || code === 48) return "Foggy";

    if (code >= 51 && code <= 67) return "Rainy";

    if (code >= 71 && code <= 77) return "Snowy";

    if (code >= 80 && code <= 82) return "Rain showers";

    if (code >= 95 && code <= 99) return "Thunderstorm";

    return "Unknown";
}


/**
 * Creates the weather widget's HTML structure.
 */
function createWeatherWidget() {

    const widget = document.createElement("aside");

    widget.id = "weather-widget";
    widget.className = "weather-widget";

    widget.setAttribute("aria-label", "Current weather in Reeuwijk");

    widget.innerHTML = `
        <h2>Reeuwijk Weather</h2>

        <p id="weather-temperature">Loading...</p>

        <p id="weather-description"></p>

        <p id="weather-humidity"></p>

        <p id="weather-status" role="status"></p>
    `;

    document.body.appendChild(widget);
}


/**
 * Updates the widget using API data.
 */
function displayWeather(weather) {

    document.getElementById("weather-temperature").textContent =
        `${Math.round(weather.temperature_2m)}°C`;

    document.getElementById("weather-description").textContent =
        getWeatherDescription(weather.weather_code);

    document.getElementById("weather-humidity").textContent =
        `Humidity: ${weather.relative_humidity_2m}%`;

    document.getElementById("weather-status").textContent = "";
}


/**
 * Initializes the widget.
 */
async function initializeWeatherWidget() {

    createWeatherWidget();

    try {

        const weather = await getWeatherData();

        displayWeather(weather);

    } catch (error) {

        document.getElementById("weather-status").textContent =
            "Unable to load weather information.";
    }
}


// Start
initializeWeatherWidget();