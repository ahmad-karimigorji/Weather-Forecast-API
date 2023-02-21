import LoadingAndMessageView from "./LoadingAndMessageView.js";

export default function getData(city) {
  LoadingAndMessageView.displaySkeletonLoading();

  const url = `https://api.weatherapi.com/v1/forecast.json?key=03dc912cd9bc4159b77152042232102&q=${city}&days=7&aqi=yes&alerts=yes`;

  return axios
    .get(url)
    .then((response) => {
      LoadingAndMessageView.hideSkeletonLoading();
      return response.data;
    })
    .catch((error) => {
      LoadingAndMessageView.displayMessage(error);
      console.log(error);
    });
}
