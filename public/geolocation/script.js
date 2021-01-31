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
    console.log(pos.coords.accuracy);
    let error = "";
    speedEle.style.fontSize = "50px";
    if(pos.coords.speed <= 0) {
        error += "<li>No speed</li>";
    }
    if(pos.coords.accuracy > 20) {
        error += "<li>Low accuracy</li>";
    }
    else {
        error += `<li>Accuracy: ${pos.coords.accuracy.toFixed(1)} m</li>`;
    }
    if(error.length > 0) {
        lowAccuracy(error);
    }
    else {
        speedEle.textContent = pos.coords.speed;
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