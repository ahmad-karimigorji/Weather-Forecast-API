import getData from "./Fetch.js";
import ForecastView from "./ForecastView.js";

export default function setUp(input = "behshahr") {
  getData(input)
    .then((data) => {
      console.log(data);
      ForecastView.setData(data);
      ForecastView.displayFirstForecast(data);
      ForecastView.displayWeekForecast(data);
    })
    .catch((error) => console.log(error));
}
