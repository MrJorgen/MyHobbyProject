import { sprites } from "./sprites.js";

export function getDaylightData() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const myLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
      let xhr = new XMLHttpRequest(),
        url = "https://api.sunrise-sunset.org/json?formatted=0" +
          "&lat=" + myLocation.lat +
          "&lng=" + myLocation.lng;

      xhr.open("GET", url, true);

      xhr.onload = function () {
        let response = JSON.parse(this.responseText);
        if (response.status == "OK") {
          let now = new Date();
          let dayBegin = new Date(response.results.nautical_twilight_begin);
          let dayEnd = new Date(response.results.nautical_twilight_end);
          let backGround = null;
          dayBegin.setMinutes(dayBegin.getMinutes() + dayBegin.getTimezoneOffset());
          dayEnd.setMinutes(dayEnd.getMinutes() + dayEnd.getTimezoneOffset());

          // Some debugging....
          // console.log("Result begin:", response.results.nautical_twilight_begin);
          // console.log("Result end:", response.results.nautical_twilight_end);
          // console.log("Now:", now);
          // console.log("Begin:", dayBegin);
          // console.log("End:", dayEnd);

          if (now > dayBegin && now < dayEnd) {
            console.log("Daytime");
            backGround = sprites.backGround.day;
          }
          else {
            console.log("Nightime");
            backGround = sprites.backGround.night;
          }
          // Tell caller everything went ok
          return backGround;
        }
        else {
          // Couldn't get proper data from sunrise-sunset.org
          return false;
        }
      }

      xhr.onerror = function () {
        // Something went wrong with the AJAX connection
        return false;
      }

      xhr.send();
    });
  }
  else {
    // No geolocation data
    return false;
  }
}
