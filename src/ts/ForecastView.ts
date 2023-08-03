import getData from "./Fetch";
import { WeatherData } from "./apiType";

const weatherImg = document.getElementById("weather-img") as HTMLDivElement;
const temp = document.getElementById("temp") as HTMLSpanElement;
const tempSymbol = document.getElementById("temp-symbol") as HTMLSpanElement;
const dateForecast = document.getElementById("date-forecast") as HTMLDivElement;
const currentDayForecast = document.getElementById(
  "current-day-forecast"
) as HTMLDivElement;
const cityName = document.getElementById("city-name") as HTMLDivElement;
const weekForecast = document.getElementById("week-forecast") as HTMLDivElement;
const uvIndex = document.getElementById("uv-index") as HTMLDivElement;
const windKph = document.getElementById("wind-kph") as HTMLSpanElement;
const windDir = document.getElementById("wind-dir") as HTMLSpanElement;
const sunrise = document.getElementById("sunrise") as HTMLSpanElement;
const sunset = document.getElementById("sunset") as HTMLSpanElement;
const humidity = document.getElementById("humidity") as HTMLDivElement;
const visibility = document.getElementById("visibility") as HTMLSpanElement;
const airQuality = document.getElementById("air-quality") as HTMLDivElement;
const airQualityDescription = document.getElementById(
  "air-quality-description"
) as HTMLSpanElement;
const inputs = document.querySelectorAll(`[name="degree"]`);
const highlilghtsTitle = document.getElementById(
  "highlights-titile"
) as HTMLHeadingElement;
const form = document.querySelector("form") as HTMLFormElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;

class ForecastView {
  data!: WeatherData;
  tempDegree: {
    centigrade: string;
    fahrenheit: string;
  } = {
    centigrade: "",
    fahrenheit: "",
  };
  constructor() {
    getData();

    inputs.forEach((item) => {
      item.addEventListener("click", (e) => this.changeDegree(e));
    });

    form.addEventListener("submit", (e) => this.searchPlace(e));
  }
  setData(data: WeatherData) {
    this.data = data;
  }
  displayFirstForecast(data: WeatherData): void {
    const currentDay = data.forecast.forecastday[0].day;

    weatherImg.innerHTML = `<img class="w-2/3 mx-auto max-h-[100px]" src=${data.current.condition.icon} alt=${data.current.condition.text}>`;

    temp.innerText = `${currentDay.avgtemp_c}`;

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
    <img class="w-10" src=${currentDay.condition.icon} alt=${currentDay.condition.text}>
    <span class="ml-2">${currentDay.condition.text}</span>
</div>
<div class="flex items-center text-sm">
    <img class="w-10" src="//cdn.weatherapi.com/weather/64x64/day/302.png" alt="rain">
    <span class="ml-2">Rain - ${currentDay.daily_chance_of_rain}%</span>
</div>`;

    cityName.innerText = `${data.location.name}, ${data.location.region}, ${data.location.country}`;

    this.tempDegree.centigrade = `${currentDay.avgtemp_c}`;
    this.tempDegree.fahrenheit = `${currentDay.avgtemp_f}`;
  }

  displayWeekForecast(data: WeatherData): void {
    const week = data.forecast.forecastday;
    let minTemp: number = 0;
    let maxTemp: number = 0;

    let result: string = "";
    week.forEach((item, index) => {
      inputs.forEach((input) => {
        if ((input as HTMLInputElement).checked && input.id === "centigrade") {
          maxTemp = item.day.maxtemp_c;
          minTemp = item.day.mintemp_c;
        } else if ((input as HTMLInputElement) && input.id === "fahrenheit") {
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

    const weekDay = document.querySelectorAll("#week-day");
    weekDay.forEach((item) => {
      item.addEventListener("click", (e) => {
        const item = e.currentTarget as HTMLDivElement;
        const id = item.dataset.id as string;
        this.displayWeekDayHighlights(data, +id);
      });
    });

    // for first time
    this.displayWeekDayHighlights(data, 0);
  }

  displayWeekDayHighlights(data: WeatherData, id: number): void {
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
    const currentHour = week[id].hour[now];
    windKph.innerHTML = `${currentHour.wind_kph} <small class="text-xs font-normal">km/h</small>`;
    windDir.innerText = currentHour.wind_dir;

    // sunrise & sunset
    sunrise.innerText = week[id].astro.sunrise;
    sunset.innerText = week[id].astro.sunset;

    // humidity
    humidity.innerHTML = `<span class="font-bold text-2xl">${currentHour.humidity}&#37;</span>
    <div role="progressbar" name="humidityProgressbar" aria-valuemin="0" aria-valuemax="100" style="--humidityValue: ${currentHour.humidity}"></div>`;

    // visibility
    visibility.innerHTML = `${currentHour.vis_km} <small class="text-xs font-normal">km</small>`;

    // air quality
    const airQualityValue = data.current.air_quality["us-epa-index"];
    if (!airQualityValue || id != 0) {
      airQuality.innerText = "";
      airQualityDescription.innerText = "no information";
      return;
    }

    airQuality.innerHTML = `<span class="font-bold text-2xl">${airQualityValue}</span>
    <div class="" role="progressbar" name="airQualityProgressbar" aria-valuemin="1" aria-valuemax="6" style="--airQualityValue: ${airQualityValue}"></div>`;

    switch (airQualityValue) {
      case 1:
        airQualityDescription.innerText = "Good";
        break;
      case 2:
        airQualityDescription.innerText = "Moderate";
        break;
      case 3:
        airQualityDescription.innerText = "Unhealthy for sensitive group";
        break;
      case 4:
        airQualityDescription.innerText = "Unhealthy";
        break;
      case 5:
        airQualityDescription.innerText = "Very Unhealthy";
        break;
      case 6:
        airQualityDescription.innerText = "Hazardous";
        break;
      default:
        break;
    }
  }

  // change degree to centigrade or fahrenheit
  changeDegree(e: Event): void {
    const id = (e.target as HTMLInputElement).id;
    if (id === "centigrade") {
      temp.innerText = this.tempDegree.centigrade;
      tempSymbol.innerHTML = "&#8451;";
    }
    if (id === "fahrenheit") {
      temp.innerText = this.tempDegree.fahrenheit;
      tempSymbol.innerHTML = "&#8457;";
    }

    this.displayWeekForecast(this.data);
  }

  searchPlace(e: Event): void {
    e.preventDefault();
    const value = searchInput.value;
    if (value.trim() === "") {
      return;
    }
    getData(value);
    searchInput.value = "";
  }
}

export default new ForecastView();
