const apiKey = "73af1e6ed9c113e827eb4bbf759c152f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherIcon = document.querySelector(".weather-icon");

async function getWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    
    console.log(data);

    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector('.humidity').innerHTML = data.main.humidity + " %";
    document.querySelector('.wind').innerHTML = data.wind.speed + " km/h";
    
    if(data.weather[0].main == "Clouds"){
        weatherIcon.src = "assets/images/clouds.png";
    } else if (data.weather[0].main == "Clear"){
        weatherIcon.src = "assets/images/clear.png";
    } else if(data.weather[0].main == "Rain"){
        weatherIcon.src = "assets/images/rain.png";
    } else if(data.weather[0].main == "Drizzle"){
        weatherIcon.src = "assets/images/drizzle.png";
    } else if(data.weather[0].main == "Mist"){
        weatherIcon.src = "assets/images/mist.png";
    }
    
    getForecast(city);
}

async function getForecast(city) {
    const response = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    displayForecast(data);
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

searchButton.addEventListener("click", function(){
    getWeather(searchInput.value);
});

getWeather("amsterdam");
