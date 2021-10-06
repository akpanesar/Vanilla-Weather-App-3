function formatDate(timestamp) {
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  let now = new Date(timestamp);
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let hour = now.getHours();
  let minute = now.getMinutes();
  let date = now.getDate();

  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `Last updated ${day}, ${date} ${month} ${hour}:${minute}`;
}

function formatTime(timestamp) {
  let now = new Date(timestamp);
  let hour = now.getHours();
  let minute = now.getMinutes();
  let date = now.getDate();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${hour}:${minute}`;
}

function formatDay(timestamp) {
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  return days[day];
}

function showForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 daily-forecast-card">
      <div class="weatherForecast-day">${formatDay(forecastDay.dt)}</div>
      <div class="weatherForecast-icon"> <img  src = "icons/${
        forecastDay.weather[0].icon
      }.svg"  alt=" "  /> </div>
      <div class="weatherForecast-tempRange"> <span class="highTemp"><strong> ${Math.round(
        forecastDay.temp.max
      )}°</strong></span>  /  <span class="lowTemp">${Math.round(
          forecastDay.temp.min
        )}°</span></div>
     <hr />
     <div class="weatherForecast-humidity">${
       forecastDay.humidity
     } % </div>      
    </div>  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getforecast(coordinates) {
  let apiKey = "3bf3d898af236340eac60ab5658c130c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showForecast);
}

function showWeather(response) {
  console.log(response);
  celsiusTemperature = response.data.main.temp;
  celsiusTemperatureHigh = response.data.main.temp_max;
  celsiusTemperatureLow = response.data.main.temp_min;

  let city = response.data.name;
  let country = response.data.sys.country;
  let tempC = Math.round(celsiusTemperature);
  let realF = Math.round(response.data.main.feels_like);
  let description = response.data.weather[0].description;
  let hTemp = Math.round(celsiusTemperatureHigh);
  let windSpeed = Math.round(response.data.wind.speed);
  let lTemp = Math.round(celsiusTemperatureLow);
  let humidity = response.data.main.humidity;
  let weather_icon = response.data.weather[0].icon;
  let bgImage = celsiusTemperature;

  let cityElement = document.querySelector("#citySearch");
  let temperatureElement = document.querySelector("#currentTemperature");
  let realFeelElement = document.querySelector("#realFeel");
  let descriptionElement = document.querySelector("#weatherDescription");
  let highTempElement = document.querySelector("#highTemp");
  let humidityElement = document.querySelector("#humidity");
  let lowTempElement = document.querySelector("#lowTemp");
  let windElement = document.querySelector("#windSpeed");
  let weatherIcon = document.querySelector("#weatherIcon");
  let currentDate = document.querySelector("#today");
  let bgImageElement = document.querySelector("body");

  if (bgImage > 24) {
    bgImageElement.classList.add("hot");
    bgImageElement.classList.remove("cloudy", "sunny", "cold");
  } else {
    if ((bgImage >= 15) & (bgImage < 24)) {
      bgImageElement.classList.add("sunny");
      bgImageElement.classList.remove("cloudy", "hot", "cold");
    } else {
      if ((bgImage > 5) & (bgImage < 15)) {
        bgImageElement.classList.add("cloudy");
        bgImageElement.classList.remove("sunny", "hot", "cold");
      } else {
        if (bgImage < 5) {
          bgImageElement.classList.add("cold");
          bgImageElement.classList.remove("sunny", "hot", "cloudy");
        }
      }
    }
  }

  cityElement.innerHTML = `${city}, ${country}`;
  temperatureElement.innerHTML = `${tempC}`;
  realFeelElement.innerHTML = ` Real  Feel:  ${realF}°`;
  descriptionElement.innerHTML = `${description}`;
  highTempElement.innerHTML = `${hTemp}°`;
  windElement.innerHTML = ` Wind:   ${windSpeed}  mps`;
  lowTempElement.innerHTML = `${lTemp}°`;
  humidityElement.innerHTML = ` Humidity: ${humidity}%`;
  weatherIcon.setAttribute("src", `icons/${weather_icon}.svg`);
  currentDate.innerHTML = formatDate(response.data.dt * 1000);

  getforecast(response.data.coord);
}
function search(city) {
  let apiKey = "3bf3d898af236340eac60ab5658c130c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showWeather);
}

function showNewCityWeather(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-input");
  search(searchInput.value);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", showNewCityWeather);

function showLocationTemperature(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentPosition);
  function showCurrentPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiKey = "3bf3d898af236340eac60ab5658c130c";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;
    axios.get(`${apiUrl}&appid=${apiKey}`).then(showWeather);
  }
}
let currentLocationButton = document.querySelector(".locationButton");
currentLocationButton.addEventListener("click", showLocationTemperature);

let celsiusTemperature = null;
let celsiusTemperatureHigh = null;
let celsiusTemperatureLow = null;

search("London");
