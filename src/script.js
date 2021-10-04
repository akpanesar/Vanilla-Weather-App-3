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
  let bgImage = response.data.weather[0].main;

  let cityElement = document.querySelector("#citySearch");
  let temperatureElement = document.querySelector("#currentTemperature");
  let realFeelElement = document.querySelector("#realFeel");
  let descriptionElement = document.querySelector("#weatherDescription");
  let highTempElement = document.querySelector("#highTemp");
  let humidityElement = document.querySelector("#humidity");
  let sunriseElement = document.querySelector("#sunrise");
  let lowTempElement = document.querySelector("#lowTemp");
  let windElement = document.querySelector("#windSpeed");
  let sunsetElement = document.querySelector("#sunset");
  let weatherIcon = document.querySelector("#weatherIcon");
  let currentDate = document.querySelector("#today");
  let bgImageElement = document.querySelector("body");

  cityElement.innerHTML = `${city}, ${country}`;
  temperatureElement.innerHTML = `${tempC}`;
  realFeelElement.innerHTML = `Real Feel ${realF}°`;
  descriptionElement.innerHTML = `${description}`;
  highTempElement.innerHTML = `${hTemp}°`;
  windElement.innerHTML = `${windSpeed} mps`;
  sunriseElement.innerHTML = formatTime(response.data.sys.sunrise * 1000);
  lowTempElement.innerHTML = `${lTemp}°`;
  humidityElement.innerHTML = `${humidity}%`;
  sunsetElement.innerHTML = formatTime(response.data.sys.sunset * 1000);
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weather_icon}@2x.png`
  );
  currentDate.innerHTML = formatDate(response.data.dt * 1000);
  bgImageElement.classList = "";
  bgImageElement.classList.add(`${bgImage}`);
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

function changeFahrenheitTemp(event) {
  event.preventDefault();
  celsiusClick.classList.remove("active");
  fahrenheitClick.classList.add("active");

  let temperatureElement = document.querySelector("#currentTemperature");
  let highTElement = document.querySelector("#highTemp");
  let lowTElement = document.querySelector("#lowTemp");
  let tempF = Math.round((celsiusTemperature * 9) / 5 + 32);
  let tempFH = Math.round((celsiusTemperatureHigh * 9) / 5 + 32);
  let tempFL = Math.round((celsiusTemperatureLow * 9) / 5 + 32);
  temperatureElement.innerHTML = `${tempF}`;
  highTElement.innerHTML = `${tempFH}°`;
  lowTElement.innerHTML = `${tempFL}°`;
}

function changeCelsiusTemp(event) {
  event.preventDefault();

  celsiusClick.classList.add("active");
  fahrenheitClick.classList.remove("active");

  let temperatureElement = document.querySelector("#currentTemperature");
  let highTElement = document.querySelector("#highTemp");
  let lowTElement = document.querySelector("#lowTemp");
  let tempC = Math.round(celsiusTemperature);
  let tempCH = Math.round(celsiusTemperatureHigh);
  let tempCL = Math.round(celsiusTemperatureLow);
  temperatureElement.innerHTML = `${tempC}`;
  highTElement.innerHTML = `${tempCH}°`;
  lowTElement.innerHTML = `${tempCL}°`;
}

let fahrenheitClick = document.querySelector("#fahrenheitLink");
fahrenheitClick.addEventListener("click", changeFahrenheitTemp);

let celsiusClick = document.querySelector("#celsiusLink");
celsiusClick.addEventListener("click", changeCelsiusTemp);

search("London");
