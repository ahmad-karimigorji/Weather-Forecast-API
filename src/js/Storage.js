export class Storage {
  static getLocalLocation() {
    const location = localStorage.getItem("Location")
      ? JSON.parse(localStorage.getItem("Location"))
      : "";
    return location;
  }

  static saveLocalLocation(location) {
    localStorage.setItem("Location", JSON.stringify(location));
  }
}

