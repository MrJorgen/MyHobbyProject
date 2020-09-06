document.addEventListener("DOMContentLoaded", () => {
  // const imagesArray = [
  //   { src: ".img/Exterior1.jpg", desc: "Front Left", id: 1 },
  //   { src: ".img/Exterior2.jpg", desc: "Left", id: 2 },
  //   { src: ".img/Exterior3.jpg", desc: "Back Left", id: 3 },
  //   { src: ".img/Exterior4.jpg", desc: "Back", id: 4 },
  //   { src: ".img/Exterior5.jpg", desc: "Front Left Zoomed", id: 7 },
  //   { src: ".img/Exterior6.jpg", desc: "Back Right", id: 5 },
  //   { src: ".img/Exterior7.jpg", desc: "Right", id: 6 },
  //   { src: ".img/Interior1.jpg", desc: "Driver Pos", id: 8 },
  //   { src: ".img/Interior2.jpg", desc: "From Right Door", id: 9 },
  // ];

  // // Elements to insert countdown timer in
  // const daysEle = document.querySelector("#days"),
  //   hoursEle = document.querySelector("#hours"),
  //   minutesEle = document.querySelector("#minutes"),
  //   secondsEle = document.querySelector("#seconds"),
  //   deliveryDate = new Date("2020-12-15 12:00:00");

  // const dateOpt = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // const timeOpt = { hour: "2-digit", minute: "2-digit"};

  // document.querySelector("#deliveryDate").textContent = `${deliveryDate.toLocaleDateString("sv-SE", dateOpt)} kl ${deliveryDate.toLocaleTimeString([], timeOpt)}`;

  // // How long is(in milliseconds):
  // const oneSecond = 1000,
  //   oneMinute = 60 * 1000,
  //   oneHour = 60 * 60 * 1000,
  //   oneDay = 24 * 60 * 60 * 1000;

  // function getRemainingTime() {
  //   const now = Date.now(),
  //     diff = deliveryDate - now;
  //   if (diff > 0) {
  //     daysEle.textContent = Math.floor(diff / oneDay).toString().padStart(2, "0");
  //     hoursEle.textContent = Math.floor((diff % oneDay) / oneHour).toString().padStart(2, "0");
  //     minutesEle.textContent = Math.floor((diff % oneHour) / oneMinute).toString().padStart(2, "0");
  //     secondsEle.textContent = Math.floor((diff % oneMinute) / oneSecond).toString().padStart(2, "0");
  //   }
  //   else {
  //     daysEle.textContent = "Bilen har(förhoppningsvis) levererats!";
  //   }
  // }

  // let countDown = setInterval(getRemainingTime, 1000);
  // getRemainingTime();

  const imagesBlack = document.querySelector("#images_black"),
    imagesBlue = document.querySelector("#images_blue"),
    specs = document.querySelector("#specs"),
    driveTrain = document.querySelector("#drive-train");

    const nav = document.querySelectorAll("nav li");

    nav.forEach((ele) => {
      ele.addEventListener("click", menuToggle);
    });

  function menuToggle(ele) {
    [imagesBlack, imagesBlue, specs, driveTrain].forEach((e) => {
      e.classList.add("hidden");
    });
    nav.forEach((e) => {
      e.classList.remove("active");
    })
    ele.target.classList.add("active");
    document.querySelector(`#${ele.target.dataset.target}`).classList.remove("hidden");
  }
});
