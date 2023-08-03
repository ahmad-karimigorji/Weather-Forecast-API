export class Storage {
  static getLocalLocation(): string {
    const location: string = localStorage.getItem("Location")
      ? JSON.parse(localStorage.getItem("Location") as string)
      : "";
    return location;
  }

  static saveLocalLocation(location: string): void {
    localStorage.setItem("Location", JSON.stringify(location));
  }
}
