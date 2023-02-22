import setUp from "./setUpData.js";

const weatherImg = document.getElementById("weather-img");
const temp = document.getElementById("temp");
const dateForecast = document.getElementById("date-forecast");
const currentDayForecast = document.getElementById("current-day-forecast");
const cityName = document.getElementById("city-name");
const weekForecast = document.getElementById("week-forecast");
const uvIndex = document.getElementById("uv-index");
const windKph = document.getElementById("wind-kph");
const windDir = document.getElementById("wind-dir");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const humidity = document.getElementById("humidity");
const visibility = document.getElementById("visibility");
const airQualify = document.getElementById("air-qualify");
const airQualifyDescription = document.getElementById(
  "air-qualify-description"
);

const inputs = document.querySelectorAll(`[name="degree"]`);
const highlilghtsTitle = document.getElementById("highlights-titile");
const form = document.querySelector("form");

class ForecastView {
  constructor() {
    setUp();
    this.data = [];

    this.tempDegree = {
      centigrade: "",
      fahrenheit: "",
    };

    inputs.forEach((item) => {
      item.addEventListener("click", (e) => this.changeDegree(e));
    });

    form.addEventListener("submit", (e) => this.searchPlace(e));
  }
  setData(data) {
    this.data = data;
  }
  displayFirstForecast(data) {
    const forecastday = data.forecast.forecastday;

    weatherImg.innerHTML = `<img class="w-2/3 mx-auto max-h-[100px]" src=${data.current.condition.icon} alt=${data.current.condition.text}>`;

    temp.innerText = forecastday[0].day.avgtemp_c;

    dateForecast.innerHTML = `<span>${new Date("2022-12-01").toLocaleDateString(
      "en-us",
      { weekday: "long" }
    )}, </span>
    <span class="text-slate-400" id="date">${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}</span>
    <span class="text-slate-300 block text-xs" id="last-update">Last updated : ${
      data.current.last_updated.split(" ")[1]
    }</span>`;

    currentDayForecast.innerHTML = `<div class="flex items-center text-sm">
    <img class="w-10" src=${forecastday[0].day.condition.icon} alt=${forecastday[0].day.condition.text}>
    <span class="ml-2">${forecastday[0].day.condition.text}</span>
</div>
<div class="flex items-center text-sm mb-4">
    <img class="w-10" src="//cdn.weatherapi.com/weather/64x64/day/302.png" alt="rain">
    <span class="ml-2">Rain - ${forecastday[0].day.daily_chance_of_rain}%</span>
</div>`;

    cityName.innerText = `${data.location.name}, ${data.location.region}, ${data.location.country}`;

    this.tempDegree.centigrade = forecastday[0].day.avgtemp_c;
    this.tempDegree.fahrenheit = forecastday[0].day.avgtemp_f;
  }

  displayWeekForecast(data) {
    const week = data.forecast.forecastday;
    let minTemp = 0;
    let maxTemp = 0;

    let result = "";
    week.forEach((item, index) => {
      inputs.forEach((input) => {
        if (input.checked && input.id === "centigrade") {
          maxTemp = item.day.maxtemp_c;
          minTemp = item.day.mintemp_c;
        } else if (input.checked && input.id === "fahrenheit") {
          maxTemp = item.day.maxtemp_f;
          minTemp = item.day.mintemp_f;
        }
      });

      result += `<div class="min-w-[100px] grow flex flex-col justify-between items-center space-y-3 bg-white rounded-lg p-2 relative overflow-hidden hover:cursor-pointer" id="week-day" data-id=${index}>
      <span>${new Date(item.date).toLocaleDateString([], {
        weekday: "short",
      })}</span>
      <img class="w-1/2" src=${item.day.condition.icon} alt=${
        item.day.condition.text
      }>
      <div class="w-full flex justify-between">
          <span>${maxTemp}°</span>
          <span class="text-slate-400">${minTemp}°</span>
      </div>
      </div>`;
    });
    weekForecast.innerHTML = result;

    this.displayWeekDayHighlights(data);

    const weekDay = document.querySelectorAll("#week-day");
    weekDay.forEach((item) => {
      item.addEventListener("click", (e) =>
        this.displayWeekDayHighlights(data, e.currentTarget.dataset.id)
      );
    });
  }

  displayWeekDayHighlights(data, id) {
    // for first time
    if (!id) id = 0;
    const week = data.forecast.forecastday;

    // title
    if (id == 0) highlilghtsTitle.innerText = `Today's Highlights`;
    else
      highlilghtsTitle.innerText = `${new Date(
        week[id].date
      ).toLocaleDateString([], {
        weekday: "long",
      })}'s Highlights`;

    // uv index
    uvIndex.innerHTML = `<h3 class="text-sm">UV index</h3>
    <div role="progressbar" name="uvProgressbar" aria-valuemin="0" aria-valuemax="12" style="--uvValue: ${week[id].day.uv}"></div>`;

    // wind status(ph)
    const now = new Date().getHours();
    windKph.innerHTML = `${week[id].hour[now].wind_kph} <small class="text-xs font-normal">km/h</small>`;
    windDir.innerText = week[id].hour[now].wind_dir;

    // sunrise & sunset
    sunrise.innerText = week[id].astro.sunrise;
    sunset.innerText = week[id].astro.sunset;

    // humidity
    humidity.innerHTML = `<span class="font-bold text-2xl">${week[id].hour[now].humidity}&#37;</span>
    <div role="progressbar" name="humidityProgressbar" aria-valuemin="0" aria-valuemax="100" style="--humidityValue: ${week[id].hour[now].humidity}"></div>`;

    // visibility
    visibility.innerHTML = `${week[id].hour[now].vis_km} <small class="text-xs font-normal">km</small>`;

    // air qualify
    const airQualifyValue = week[id].day.air_quality["us-epa-index"];
    if (!airQualifyValue) {
      airQualify.innerText = "";
      airQualifyDescription.innerText = "no information";
      return;
    }

    airQualify.innerHTML = `<span class="font-bold text-2xl">${airQualifyValue}</span>
    <div class="" role="progressbar" name="airQualifyProgressbar" aria-valuemin="1" aria-valuemax="6" style="--airQualifyValue: ${airQualifyValue}"></div>`;

    if (airQualifyValue === 1) airQualifyDescription.innerText = "Good";
    else if (airQualifyValue === 2)
      airQualifyDescription.innerText = "Moderate";
    else if (airQualifyValue === 3)
      airQualifyDescription.innerText = "Unhealthy for sensitive group";
    else if (airQualifyValue === 4)
      airQualifyDescription.innerText = "Unhealthy";
    else if (airQualifyValue === 5)
      airQualifyDescription.innerText = "Very Unhealthy";
    else airQualifyDescription.innerText = "Hazardous";
  }

  // change degree to centigrade or fahrenheit
  changeDegree(e) {
    if (e.target.id === "centigrade") {
      temp.innerText = this.tempDegree.centigrade;
      temp.nextElementSibling.innerHTML = "&#8451;";
    }
    if (e.target.id === "fahrenheit") {
      temp.innerText = this.tempDegree.fahrenheit;
      temp.nextElementSibling.innerHTML = "&#8457;";
    }

    this.displayWeekForecast(this.data);
  }

  searchPlace(e) {
    e.preventDefault();
    const item = e.target.lastElementChild.value;
    if (item.trim() === "") {
      return;
    }
    setUp(item);
    e.target.lastElementChild.value = "";
  }
}

export default new ForecastView();
