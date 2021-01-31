let speedEle = document.querySelector("#speed");

speedEle.textContent = "test";

if(navigator.geolocation) {
    console.log("Geolocation supported");
    speedEle.textContent = "OK";
}
else {
    console.log("Geolocation NOT supported");
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);

function onSuccess(pos) {
    console.log(pos);
    console.log(pos.coords.accuracy);
    speedEle.style.fontSize = "50px";
    if(pos.coords.speed > 0) {
        speedEle.textContent = pos.coords.speed;
    }
    if(pos.coords.accuracy > 50) {
        lowAccuracy();
    }
}

function onError(error) {
    console.log(error);
    console.log(error.message);
    speedEle.style.fontSize = "25px";
    speedEle.textContent = error.message;
  }

  function lowAccuracy() {
    document.querySelector("#error").textContent = "Low accuracy or no speed";
  }