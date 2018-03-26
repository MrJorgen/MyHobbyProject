document.addEventListener("DOMContentLoaded", (e) => {
  let weekNr = document.querySelector("#weekNrInput"),
    dateStart = document.querySelector("#dateStartInput"),
    monthStart = document.querySelector("#monthStartInput"),
    dateEnd = document.querySelector("#dateEndInput"),
    monthEnd = document.querySelector("#monthEndInput"),
    year = document.querySelector("#yearInput");
  
  weekNr.value = new Date().getWeek();
  
  let firstDayOfWeek = getFirstDayOfWeek();
  dateStart.value = firstDayOfWeek.getDate();
  monthStart.value = firstDayOfWeek.getMonth() + 1;

  let lastDayOfWeek = new Date();
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  dateEnd.value = lastDayOfWeek.getDate();
  monthEnd.value = lastDayOfWeek.getMonth() + 1;
  
  year.value = parseInt(firstDayOfWeek.getFullYear()) - 2000;

});

function getFirstDayOfWeek() {
  let tmpDate = new Date();
  while (tmpDate.getDay() !== 0) {
    tmpDate.setDate(tmpDate.getDate() - 1);
  }
  return tmpDate;
}



// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  let date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  let week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7));
};

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

// document.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log(e);
//   makeNewInput(e);
// });

function makeNewInput(e) {
  if (e.target == document.body) {
    let tmpElm = document.createElement("input");
    tmpElm.type = "text";
    tmpElm.style.position = "absolute";
    tmpElm.style.left = e.offsetX + "px";
    tmpElm.style.top = e.offsetY + "px";
    document.body.appendChild(tmpElm);
    tmpElm.focus();
  }
}