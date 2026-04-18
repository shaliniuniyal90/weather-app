const apiKey = "abddd6cfb5209fd486cf85851ab19aa9";


async function getWeather() {
  const city = document.getElementById("city").value;
  const suggestionBox = document.getElementById("suggestion");

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // 🔄 Loading state
  document.getElementById("cityName").innerText = "Loading...";
  document.getElementById("temp").innerText = "--";
  document.getElementById("condition").innerText = "";
  suggestionBox.innerText = "";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      document.getElementById("cityName").innerText = "❌ City not found";
      return;
    }

    updateUI(data);
    getForecast(city); // ⭐ forecast call

  } catch (error) {
    document.getElementById("cityName").innerText = "⚠️ Error fetching data";
  }
}


function updateUI(data) {
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temp").innerText =
    Math.round(data.main.temp) + "°C";

  document.getElementById("condition").innerText =
    data.weather[0].main;

 
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  
  document.getElementById("humidity").innerText =
    "Humidity: " + data.main.humidity + "%";

  document.getElementById("wind").innerText =
    "Wind: " + data.wind.speed + " km/h";

  document.getElementById("feels").innerText =
    "Feels like: " + Math.round(data.main.feels_like) + "°C";

  
  let suggestion = "";

  if (data.main.temp > 30) {
    suggestion = "Hot ☀️ → Stay hydrated 💧";
  } else if (data.main.temp < 15) {
    suggestion = "Cold ❄️ → Wear jacket 🧥";
  } else if (data.weather[0].main.includes("Rain")) {
    suggestion = "Rain 🌧️ → Carry umbrella ☔";
  } else {
    suggestion = "Nice weather 😄";
  }

  document.getElementById("suggestion").innerText = suggestion;

  
  changeBackground(data.weather[0].main, data.weather[0].icon);
}


function changeBackground(condition, icon) {
  const body = document.body;

  const isNight = icon.includes("n");

  body.classList.remove("dark");

  if (isNight) {
    body.style.background = "#0f172a";
    body.style.color = "#fff";
    body.classList.add("dark");
  }
  else if (condition.includes("Rain")) {
    body.style.background = "#1e293b";
    body.style.color = "#fff";
    body.classList.add("dark");
  } 
  else if (condition.includes("Cloud")) {
    body.style.background = "#dfe9f3";
    body.style.color = "#222";
  } 
  else if (condition.includes("Clear")) {
    // 🌅 SUNNY → ORANGE THEME
    body.style.background = "linear-gradient(to right, #f7971e, #ffd200)";
    body.style.color = "#222";
  } 
  else {
    body.style.background = "#f4f7fb";
    body.style.color = "#222";
  }
}


// ⭐ 5-DAY FORECAST
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    let forecastHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {
      const item = data.list[i];

      forecastHTML += `
        <div class="forecast-card">
          <p>${new Date(item.dt_txt).toDateString()}</p>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png"/>
          <p>${Math.round(item.main.temp)}°C</p>
        </div>
      `;
    }

    document.getElementById("forecast").innerHTML = forecastHTML;

  } catch (error) {
    console.log("Forecast error:", error);
  }
}