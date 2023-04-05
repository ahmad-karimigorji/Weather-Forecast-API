import LoadingAndMessageView from "./LoadingAndMessageView.js";

export default function getData(city) {
  LoadingAndMessageView.displaySkeletonLoading();

  const url = `https://api.weatherapi.com/v1/forecast.json?key=11b5140b543a45e6920203848230504&q=${city}&days=7&aqi=yes&alerts=yes`;

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
