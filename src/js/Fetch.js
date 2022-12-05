// require("dotenv").config();
// const apiKey = process.env.API_KEY;

export default async function getData(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=5e49d263c6ab4dec9c4134103222411&q=${city}&days=7&aqi=yes&alerts=yes`;

    return axios
      .get(url)
      .then((response) => {return response.data})
      .catch((error) => console.log(error));


}
