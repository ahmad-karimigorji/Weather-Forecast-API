import LoadingAndMessageView from "./LoadingAndMessageView.js";
import { Storage } from "./Storage.js";
import setUp from "./setUpData.js";
const locationButton = document.getElementById("get-location");
// let locationDiv = document.getElementById("location-details");

class GeoLocation {
  constructor() {
    locationButton.addEventListener("click", () => {
      //Geolocation APU is used to get geographical position of a user and is available inside the navigator object
      LoadingAndMessageView.displaySkeletonLoading()
      if (navigator.geolocation) {
        //returns position(latitude and longitude) or error
        navigator.geolocation.getCurrentPosition(
          this.showLocation,
          this.checkError
        );
      } else {
        //For old browser i.e IE
        const text = "The browser does not support geolocation";
        LoadingAndMessageView.displayLocationMessage(text);
      }
    });
  }

  //Error Checks
  checkError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        {
          const text = "Please allow access to location";
          LoadingAndMessageView.displayLocationMessage(text);
        }

        break;
      case error.POSITION_UNAVAILABLE:
        {
          //usually fired for firefox
          const text = "Location Information unavailable";
          LoadingAndMessageView.displayLocationMessage(text);
        }

        break;
      case error.TIMEOUT: {
        const text = "The request to get user location timed out";
        LoadingAndMessageView.displayLocationMessage(text);
      }
    }
  };

  showLocation = async (position) => {
    //We user the NOminatim API for getting actual address from latitude and longitude
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let { data } = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`
    );

    data = data.address.town || data.address.county || data.address.state;
    Storage.saveLocalLocation(data)
    setUp(data);
  };
}

export default new GeoLocation();
