
const hourHand = document.querySelector('[data-hour-hand]'),
minuteHand = document.querySelector('[data-minute-hand]'),
secondHand = document.querySelector('[data-second-hand]');

// setInterval(setClock, 1000);
// setClock();

requestAnimationFrame(setClock);

function setClock() {
  const currentDate = new Date();
  const secondsRatio = currentDate.getSeconds() / 60;
  const minutesRatio = (secondsRatio + currentDate.getMinutes()) / 60;
  const hoursRatio = (minutesRatio + currentDate.getHours()) / 12;
  setRotation(secondHand, secondsRatio);
  setRotation(minuteHand, minutesRatio);
  setRotation(hourHand, hoursRatio);
  requestAnimationFrame(setClock);
}

function setRotation(element, rotationRatio) {
  element.style.setProperty('--rotation', rotationRatio * 360);
}
