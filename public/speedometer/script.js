let speedEle = document.querySelector("#speed"),
  startButton = document.querySelector(".css-button-start"),
  stopButton = document.querySelector(".css-button-stop"),
  debug = true;

const dummyAudio = document.querySelector("#dummyAudio");
let positions = [], distanceTraveled = 0, readDistance = false;

let donken = {
  tornby: {
    lat: 58.432492,
    lon: 15.589988,
  },
  ryd: {
    lat: 58.406409,
    lon: 15.57827,
  },
};

const options = {enableHighAccuracy: true, timeout: 1000, maximumAge: 0};

const errors = {
  noSpeed: {error: false, text: "<li>No speed data</li>"},
  lowAccuracy: {error: false, text: "<li>Low accuracy</li>", accuracy: null}
};

const accuracyRange = [
  {value: 8, cssClass: "bar-high"},
  {value: 12, cssClass: "bar-mid-high"},
  {value: 20, cssClass: "bar-mid-low"},
  {value: 100, cssClass: "bar-low"},
  {value: Infinity, cssClass: "bar-none"}
];

if (navigator.geolocation) {
  console.log("Geolocation supported");
  navigator.geolocation.watchPosition(onSuccess, onError, options);
} else {
  console.log("Geolocation NOT supported");
}

function onSuccess(pos) {
  positions.push(pos.coords)
  while(positions.length > 2){
    positions.splice(2, 1);
  }
  console.log(positions);
  document.querySelector("#error").innerHTML = "";

  let bar = document.querySelector("#accuracy-bar");
  for (let i = 0; i < accuracyRange.length; i++) {
    if (pos.coords.accuracy < accuracyRange[i].value) {
      bar.className = "";
      bar.classList.add(accuracyRange[i].cssClass);
      break;
    }
  }

  let errorMessage = "",
    error = false;

  if (pos.coords.speed === null) {
    errors.noSpeed.error = true;
    errorMessage += errors.noSpeed.text;
    error = true;
  }

  if (pos.coords.accuracy > 50) {
    errors.lowAccuracy.error = true;
    error = true;
    errorMessage += errors.lowAccuracy.text;
  }

  if (!error) {
    errorMessage += `<li>Accuracy: ${pos.coords.accuracy.toFixed(1)} m</li>`;
    
    distanceTraveled += (distanceInKmBetweenEarthCoordinates(positions[0].latitude, positions[0].longitude, positions[1].latitude, positions[1].longitude) * 1000);
    let kmH = pos.coords.speed * 3.6;
    speedEle.textContent = Math.round(kmH);
  } else {
    document.querySelector("#error").innerHTML = errorMessage;
  }
  if (debug) {
    console.log(pos, positions);
    let speedText = pos.coords.speed === null ? "No measurment<br>" : pos.coords.speed.toFixed(2) + "m/s<br>";
    document.querySelector("#info").innerHTML = "";
    document.querySelector("#info").innerHTML += `Accuracy: ${pos.coords.accuracy.toFixed(1)} m<br>`;
    document.querySelector("#info").innerHTML += "Speed: " + speedText;
    document.querySelector("#info").innerHTML += "Dist to: " + (distanceInKmBetweenEarthCoordinates(donken.ryd.lat, donken.ryd.lon, pos.coords.latitude, pos.coords.longitude) * 1000).toFixed(2) + " meter<br>";
    if(readDistance) {
      document.querySelector("#info").innerHTML += "Distance traveled: " + Math.floor(distanceTraveled) + " m";
    }
    // document.querySelector("#info").innerHTML += `Age: ${Date.now() - pos.timestamp} ms`;
  }
}

function onError(error) {
  console.log(error);
  console.log(error.message);
  speedEle.style.fontSize = "25px";
  speedEle.textContent = error.message;
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371.071;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

[startButton, stopButton].forEach((ele) => {
  ele.addEventListener("click", (e) => {
  toggleVisibility(e);
  })
});

function toggleVisibility(e) {
  console.log(e.target);
  dummyAudio.loop = true;
  dummyAudio.play();
  distanceTraveled = 0;
  readDistance = !readDistance;  
  [startButton, stopButton].forEach((ele) => {
    ele.classList.toggle("display-none");
  })
}