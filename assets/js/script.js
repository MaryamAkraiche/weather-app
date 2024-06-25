const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const temperatureHistoryContainer = document.querySelector(".history-container");

const apiKey = "73af1e6ed9c113e827eb4bbf759c152f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

searchButton.addEventListener("click", function(){
    const searchedCity = searchInput.value.trim();
    if (searchedCity !== '') {
        getWeather(searchedCity);
        saveSearchToLocalStorage(searchedCity);
    } else {
        console.error('Please enter a city name');
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        
        
        saveCityTemperature(city, Math.round(data.main.temp));
        
        saveCityWeather(city, document.querySelector('.weather').innerHTML);
        
        updateWeatherUI(data);

        getForecast(city);

        updateTemperatureHistoryUI();
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }
}

function updateWeatherUI(data) {
    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector('.humidity').innerHTML = data.main.humidity + " %";
    document.querySelector('.wind').innerHTML = data.wind.speed + " km/h";
    const weatherIcon = document.querySelector(".weather-icon");
    weatherIcon.src = getWeatherIconUrl(data.weather[0].main);
}

function getWeatherIconUrl(weatherMain) {
    if (weatherMain === "Clouds") {
        return "assets/images/clouds.png";
    } else if (weatherMain === "Clear") {
        return "assets/images/clear.png";
    } else if (weatherMain === "Rain") {
        return "assets/images/rain.png";
    } else if (weatherMain === "Drizzle") {
        return "assets/images/drizzle.png";
    } else if (weatherMain === "Mist") {
        return "assets/images/mist.png";
    } else {
        return "assets/images/unknown.png";
    }
}

function saveCityTemperature(city, temperature) {
    localStorage.setItem(city + '_temperature', temperature);
}

function saveCityWeather(city, weatherHtml) {
    localStorage.setItem(city + '_weather', weatherHtml);
}

function saveSearchToLocalStorage(city) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(city);
    const maxHistoryLength = 10;
    const truncatedHistory = searchHistory.slice(-maxHistoryLength);
    localStorage.setItem('searchHistory', JSON.stringify(truncatedHistory));
}

function getForecast(city) {
    fetch(forecastApiUrl + city + `&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast data:', error.message));
}

function displayForecast(data) {
    const daysSection = document.querySelector('.days-section');
    daysSection.innerHTML = "";

    const today = new Date();
    let dayCounter = 0;

    for (let i = 0; i < data.list.length; i++) {
        const forecast = data.list[i];
        const forecastDate = new Date(forecast.dt * 1000);
        
        if (forecastDate.getDate() === today.getDate()) {
            continue;
        }

        if (forecastDate < today) {
            continue;
        }

        if (dayCounter < 5) {
            const day = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
            const temp_min = Math.round(forecast.main.temp_min) + "°C";
            const temp_max = Math.round(forecast.main.temp_max) + "°C";
            const weatherIconUrl = getWeatherIconUrl(forecast.weather[0].main);

            const dayCard = document.createElement('div');
            dayCard.classList.add('day-card');
            dayCard.innerHTML = `
                <div class="day-card-date">${day}</div>
                <img src="${weatherIconUrl}" class="day-weather-icon">
                <div>${temp_min} / ${temp_max}</div>
            `;
            
            daysSection.appendChild(dayCard);
            
            dayCounter++;
            
            today.setDate(today.getDate() + 1);
        } else {
            break;
        }
    }
}

function updateTemperatureHistoryUI() {
    const temperatureHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    temperatureHistoryContainer.innerHTML = "";
    for (const city of temperatureHistory) {
        const historyItem = document.createElement('div');
        historyItem.classList.add('weather-history');
        historyItem.innerHTML = localStorage.getItem(city + '_weather');
        temperatureHistoryContainer.appendChild(historyItem);
    }
}

const hamburgerButton = document.querySelector(".hamburger");
const historyContainer = document.querySelector(".history-container");

hamburgerButton.addEventListener("click", function() {
    historyContainer.classList.toggle("visible");
});

// Initial weather data for a default city
getWeather("amsterdam");
