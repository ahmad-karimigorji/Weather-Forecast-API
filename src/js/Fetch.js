import LoadingAndMessageView from "./LoadingAndMessageView.js";

export default function getData(city) {
  LoadingAndMessageView.displaySkeletonLoading();

  const url = `https://api.weatherapi.com/v1/forecast.json?key=5e49d263c6ab4dec9c4134103222411&q=${city}&days=7&aqi=yes&alerts=yes`;

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
