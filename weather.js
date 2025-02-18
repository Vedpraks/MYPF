const apiUrl = 'https://api.open-meteo.com/v1/forecast?current_weather=true&humidity_2m=true&';

document.querySelector(".search button").addEventListener("click", () => {
    const city = document.querySelector(".search input").value.trim();
    if (city) {
        fetchWeather(city);
    }
});

document.querySelector(".search input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const city = document.querySelector(".search input").value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

async function fetchWeather(city) {
    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) throw new Error("City not found");
        
        const { latitude, longitude, name } = geoData.results[0];
        const response = await fetch(`${apiUrl}latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`);
        const data = await response.json();
        
        document.querySelector(".cityname").innerText = name;
        document.querySelector(".temp").innerText = `${Math.round(data.current_weather.temperature)}°C`;
        document.querySelector(".humidity").innerText = `${data.hourly.relative_humidity_2m[0]}%`;
        document.querySelector(".wind").innerText = `${data.current_weather.windspeed} km/h`;

        const weatherIcon = document.querySelector(".weather-action");
        updateWeatherIcon(data.current_weather.weathercode, weatherIcon);
    } catch (error) {
        alert("Error: " + error.message);
        console.error(error);
    }
}

function updateWeatherIcon(code, imgElement) {
    const icons = {
        0: "https://cdn-icons-png.flaticon.com/512/869/869869.png", // Clear
        1: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png", // Partly Cloudy
        2: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png", // Cloudy
        3: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png", // Overcast
        45: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png", // Fog
        48: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png", // Fog
        51: "https://cdn-icons-png.flaticon.com/512/4834/4834676.png", // Drizzle
        61: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png", // Rain
        71: "https://cdn-icons-png.flaticon.com/512/642/642102.png", // Snow
        95: "https://cdn-icons-png.flaticon.com/512/1147/1147297.png" // Thunderstorm
    };
    imgElement.src = icons[code] || icons[0];
}
