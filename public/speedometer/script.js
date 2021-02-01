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

if(navigator.geolocation) {
    console.log("Geolocation supported");
    navigator.geolocation.watchPosition(onSuccess, onError, options);
}
else {
    console.log("Geolocation NOT supported");
}


function onSuccess(pos) {
    document.querySelector("#error").innerHTM = "";
    console.log(pos);

    let errorMessage = "", error = false;

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
        let kmH = pos.coords.speed * 3.6;
        speedEle.textContent = Math.round(kmH);
    }
    else {
        document.querySelector("#error").innerHTML = errorMessage;
    }
    if(debug) {
        document.querySelector("#info").innerHTML = "";
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
