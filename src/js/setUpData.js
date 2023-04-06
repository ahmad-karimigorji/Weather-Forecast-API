import getData from "./Fetch.js";
import ForecastView from "./ForecastView.js";
import { Storage } from "./Storage.js";

export default function setUp(input) {
  let cityName = input || Storage.getLocalLocation() || 'tehran'
  getData(cityName)
    .then((data) => {
      console.log(data);
      ForecastView.setData(data);
      ForecastView.displayFirstForecast(data);
      ForecastView.displayWeekForecast(data);
    })
    .catch((error) => console.log(error));
}
