// Displaying current date and time:
function formatDate(date) {
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  let month = months[date.getMonth()];
  let dateToday = date.getDate();
  let year = date.getFullYear();
  year = year.toString().substr(-2);
  return `${dateToday}/${month}/${year} ${hour}:${minute}`;
}

let today = new Date();
let displayDate = document.querySelector("#date");

date.innerHTML = formatDate(today);

// Displaying and formatting the forecast days

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

// Displaying weather and City

function displayWeather(response) {
  let currentTemp = document.querySelector("#degrees");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  let currentCity = document.querySelector("#city");
  currentCity.innerHTML = response.data.name;
  let currentWind = document.querySelector("#wind");
  currentWind.innerHTML = Math.round(response.data.wind.speed);
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = response.data.main.humidity;
  let currentDescription = document.querySelector("#description");
  currentDescription.innerHTML = response.data.weather[0].description;
  let currentMax = document.querySelector("#max");
  currentMax.innerHTML = Math.round(response.data.main.temp_max);
  let currentMin = document.querySelector("#min");
  currentMin.innerHTML = Math.round(response.data.main.temp_min);
  let currentIcon = document.querySelector("#icon");
  currentIcon.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.png`
  );
  currentIcon.setAttribute("alt", response.data.weather[0].description);
  celsiusTemperature = response.data.main.temp;
  getForecast(response.data.coord);
}

// Using the search input as the city input for weather

function searchForCity(city) {
  //receiving the parameter, which will be added into the URL because of the equal name
  let apiKey = "124272278a96bcddbf4006dadb388f0d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-city-input").value;
  searchForCity(cityInput); //passing the value of the search input as a parameter to the function searchForCity
}

let cityForm = document.querySelector("#search-form");
cityForm.addEventListener("submit", handleSubmit);

// get weather for current location

function handlePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "124272278a96bcddbf4006dadb388f0d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let locationSearch = document.querySelector("#search-current-location");
locationSearch.addEventListener("click", getCurrentPosition);

// Search a default city on reload
searchForCity("Melbourne");

// get random advice button
function displayAdvice(callback) {
  let newAdvice = document.querySelector("#advice");
  newAdvice.innerHTML = callback.data.slip.advice;
}

// show advice when resfresh
function defaultAdvice() {
  let Url = "https://api.adviceslip.com/advice";
  axios.get(Url).then(displayAdvice);
}
defaultAdvice();

// get weather for forecast
function getForecast(coordinates) {
  let apiKey = "782ad18fe7bd9451c9bf2ed2a9967350";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
// display forecast

function displayForecast(response) {
  let forecastDaily = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecastDaily.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="row d-flex align-items-center textstyle">
    <div class="col-3 forecast-day">${formatForecastDay(forecastDay.dt)}</div>
    <div class="col-2 text-nowrap forecast-temperature">
      <span class="forecast-temperature-min">${Math.round(
        forecastDay.temp.min
      )}°</span>
      |
    <span class="forecast-temperature-max">${Math.round(
      forecastDay.temp.max
    )}°</span>
    </div>
   <div class="col-2">
    <img src="images/${forecastDay.weather[0].icon}.png" 
      alt="" 
      width="60px" 
      class="forecastIcon"/>
    </div>
    </div>
  `;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}
