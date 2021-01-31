let speedEle = document.querySelector("#speed");

let options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
  };

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
    console.log(pos);
    let error = "";
    speedEle.style.fontSize = "50px";
    if(pos.coords.speed === null) {
        error += "<li>No speed data</li>";
    }

    if(pos.coords.accuracy > 50) {
        error += "<li>Low accuracy</li>";
    }
    else {
        error += `<li>Accuracy: ${pos.coords.accuracy.toFixed(1)} m</li>`;
        let kmH = pos.coords.speed * 1000 / 3600;
        speedEle.textContent = Math.round(kmH) + " km/h";
    }

    if(error.length > 0) {
        lowAccuracy(error);
    }
}

function onError(error) {
    console.log(error);
    console.log(error.message);
    speedEle.style.fontSize = "25px";
    speedEle.textContent = error.message;
  }

  function lowAccuracy(error) {
    document.querySelector("#error").innerHTML = error;
  }