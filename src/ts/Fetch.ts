import LoadingAndMessageView from "./LoadingAndMessageView";
import ForecastView from "./ForecastView";
import { Storage } from "./Storage";
import axios from "axios";

export default async function getData(city?: string): Promise<void> {
  LoadingAndMessageView.displaySkeletonLoading();
  let cityName: string = city || Storage.getLocalLocation() || "tehran";

  const url = `https://api.weatherapi.com/v1/forecast.json?key=11b5140b543a45e6920203848230504&q=${cityName}&days=7&aqi=yes&alerts=yes`;

  try {
    const response = await axios.get(url);
    LoadingAndMessageView.hideSkeletonLoading();
    ForecastView.setData(response.data);
    ForecastView.displayFirstForecast(response.data);
    ForecastView.displayWeekForecast(response.data);
    console.log(response.data);
  } catch (error: any) {
    if (!error.response) LoadingAndMessageView.displayMessage(error.message);
    else
      LoadingAndMessageView.displayMessage(error.response.data.error.message);

    console.log(error);
  }
}
