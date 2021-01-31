let speedEle = document.querySelector("#speed"), debug = true;

const options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
  };

  const errors = {
      noSpeed: {
          error: false,
          text: "<li>No speed data</li>"
      },
      lowAccuracy: {
          error: false,
          text: "<li>Low accuracy</li>",
          accuracy: null
      }
  }

speedEle.textContent = "test";

if(navigator.geolocation) {
    console.log("Geolocation supported");
    speedEle.textContent = "OK";
}
else {
    console.log("Geolocation NOT supported");
}

navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

function onSuccess(pos) {
    document.querySelector("#error").innerHTM = "";
    console.log(pos);

    let errorMessage = "", error = false;

    speedEle.style.fontSize = "50px";
    if(pos.coords.speed === null) {
        errors.noSpeed.error = true;
        errorMessage += errors.noSpeed.text;
        error = true;
    }

    if(pos.coords.accuracy > 50) {
        errors.lowAccuracy.error = true;
        error = true;
        errorMessage += errors.lowAccuracy.text;
    }

    if(!error) {
        errorMessage += `<li>Accuracy: ${pos.coords.accuracy.toFixed(1)} m</li>`;
        let kmH = pos.coords.speed * 1000 / 3600;
        speedEle.textContent = Math.round(kmH) + " km/h";
    }
    else {
        document.querySelector("#error").innerHTML = errorMessage;
    }
    if(debug) {
        document.querySelector("#info").innerHTML += `Accuracy: ${pos.coords.accuracy.toFixed(1)} m<br>`;
        document.querySelector("#info").innerHTML += `Speed: ${pos.coords.speed} m/s<br>`;
        document.querySelector("#info").innerHTML += `Age: ${Date.now() - pos.timestamp} ms`;
    }
}

function onError(error) {
    console.log(error);
    console.log(error.message);
    speedEle.style.fontSize = "25px";
    speedEle.textContent = error.message;
  }