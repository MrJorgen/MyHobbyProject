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
    // speedEle.textContent = pos.coords.accuracy;
    if(pos.coords.speed > 0) {
        speedEle.textContent = pos.coords.speed;
    }
}

function onError(error) {
    console.log(error);
    console.log(error.message);
    speedEle.style.fontSize = "25px";
    speedEle.textContent = error.message;
  }

  function lowAccuracy() {

  }