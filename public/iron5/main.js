import {drivers, schemaStartDate, schema} from "./schema.js";
import {craeateSceduleByPerson, dateToString} from "./functions.js";

// header + table + inputFields
// 36.5 + (80 * weeksToDisplay) + 43 = totalHeight
// 36.5 + (43.5 * weeksToDisplay) + 43 = totalHeight
const dayNames = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör"],
  HEIGHT = window.innerHeight,
  WIDTH = window.innerWidth,
  schemaLength = schema.length,
  swipeDist = WIDTH / 4;
export let individualWeeksToDisplay = Math.floor((HEIGHT - 80) / 60);
let today = new Date(),
  weeksToDisplay = Math.floor((HEIGHT - 80) / 100),
  specificDate = true;
let urlParams = new URLSearchParams(window.location.search);

let start = null;
const c0 = document.querySelector("#container0"), c1 = document.querySelector("#container1"), c2 = document.querySelector("#container2");

function makeScedule(person) {
  urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("person") || person) {
    // Set selected index in nameSelect
    for (let i = 0; i < document.querySelector("#nameInput").options.length; i++) {
      if (document.querySelector("#nameInput").options[i].text == urlParams.get("person")) {
        document.querySelector("#nameInput").selectedIndex = i;
        break;
      }
    }

    const template = makePersonalScedule(urlParams.get("person") || person);
    document.querySelector("#container0").innerHTML = template["0"];
    document.querySelector("#container1").innerHTML = template["1"];
    document.querySelector("#container2").innerHTML = template["2"];
    return;
  }

  let previous = new Date(today);
  previous.setDate(previous.getDate() - (weeksToDisplay * 7));
  let next = new Date(today);
  next.setDate(next.getDate() + (weeksToDisplay * 7));

  clearTables();
  const prevTable = makeTable("prev", previous, WIDTH);
  const currentTable = makeTable("current", today, WIDTH);
  const nextTable = makeTable("next", next, WIDTH);
  document.querySelector("#container0").innerHTML = "";
  document.querySelector("#container1").innerHTML = "";
  document.querySelector("#container2").innerHTML = "";
  document.querySelector("#container0").appendChild(prevTable);
  document.querySelector("#container1").appendChild(currentTable);
  document.querySelector("#container2").appendChild(nextTable);
}

function makeTable(id, currentDay, leftMargin) {
  // if (currentDay.getWeek() < new Date().getWeek()) {
  //   return;
  // }
  let startOfWeek = new Date(currentDay);
  if (startOfWeek.getDay() == 0) {
    startOfWeek.setDate(startOfWeek.getDate() + 1);
  } else if (startOfWeek.getDay() == 6) {
    startOfWeek.setDate(startOfWeek.getDate() + 2);
  } else if (startOfWeek.getDay() > 1 && startOfWeek.getDay() < 6) {
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  }
  let schemaTable = document.createElement("table");
  schemaTable.id = id;

  // Start weeks to show loop here
  // ----------------------------------------------------------
  for (let k = 0; k < weeksToDisplay; k++) {
    let tableHeader = document.createElement("thead");
    let weekHeader = document.createElement("tr");
    weekHeader.classList.add("week");

    let weekRow = document.createElement("th");
    weekRow.classList.add("weeknr");
    weekRow.colSpan = dayNames.length + 1;
    weekRow.innerHTML = "Vecka " + startOfWeek.getWeek();

    weekHeader.appendChild(weekRow);
    tableHeader.appendChild(weekHeader);

    let daysRow = document.createElement("tr");
    tableHeader.appendChild(daysRow);

    // Create header for table
    for (let i = -1; i < dayNames.length; i++) {
      let tmpCell = document.createElement("th");
      if (i < 0) {
        // tmpCell.innerText = "Pass";
        tmpCell.innerText = "";
      } else {
        tmpCell.innerHTML = dayNames[i] + `<p class="nobold small"> ${dateToString(startOfWeek, i)}</p>`;
        if (i == today.getDay() - 1 && startOfWeek.getWeek() == today.getWeek() && specificDate) {
          tmpCell.classList.add("active", "active-top");
        }
      }
      daysRow.appendChild(tmpCell);
    }
    schemaTable.appendChild(tableHeader);
    let tableBody = document.createElement("tbody");

    // First, iterate through nr of trucks
    for (let i = 0; i < Object.keys(schema[0][0]).length; i++) {
      // Create a new row
      let tmpRow = document.createElement("tr");
      if (i == Object.keys(schema[0][0]).length - 1) {
        tmpRow.classList.add("border-bottom");
      }

      // Loop through each day of the week
      // Add header to row
      let tmpCell = document.createElement("th");
      tmpCell.classList.add("align-left");
      tmpCell.innerText = Object.keys(schema[0][0])[i];
      tmpRow.appendChild(tmpCell);

      // Loop through each day of the trucks scedule
      // Trying new approach...
      let weekMillis = 1000 * 60 * 60 * 24 * 7;
      let weekDiff = Math.floor((startOfWeek - schemaStartDate) / weekMillis);

      for (let j = 0; j < schema[0].length; j++) {
        tmpCell = document.createElement("td");
        tmpCell.innerText = schema[(weekDiff) % schemaLength][j][Object.keys(schema[0][0])[i]] || "";
        if (j == today.getDay() - 1 && startOfWeek.getWeek() == today.getWeek() && specificDate) {
          tmpCell.classList.add("active");
          if (i == Object.keys(schema[0][0]).length - 1) {
            tmpCell.classList.add("active-bottom");
          }
        }
        tmpRow.appendChild(tmpCell);
      }

      tableBody.appendChild(tmpRow);
    }
    schemaTable.appendChild(tableBody);
    startOfWeek.setDate(startOfWeek.getDate() + 7);
    //currentWeek = startOfWeek.getWeek();
  }
  // document.querySelector("#container").appendChild(schemaTable);
  return schemaTable;
}

function makePersonalScedule(person) {
  let persons = [];

  // Search to verify the person exists in scedule
  // Loop weeks
  for (let i = 0; i < schema.length; i++) {
    // Loop days
    for (let j = 0; j < schema[i].length; j++) {
      // Loop trucks
      for (let truck in schema[i][j]) {
        persons.push(schema[i][j][truck].toLowerCase());
      }
    }
  }

  // Person found in scedule, good to go
  if (persons.includes(person.toLowerCase())) {
    let template = {
      0: craeateSceduleByPerson(person, schema, today, -1),
      1: craeateSceduleByPerson(person, schema, today, 0),
      2: craeateSceduleByPerson(person, schema, today, 1)
    }
    return template;
  }
  // Person not found in scedule, aborting
  else {
    console.log(`Couldn"t find ${person}!`);
  }
}

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
  let date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  let week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
  );
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#dateInput").setAttribute("min", new Date().toISOString().split("T")[0]);
  for (let driver of drivers){
    document.querySelector("#nameInput").add(new Option(driver, driver));
  }
  makeScedule();
  // outOfOrder();
});

document.querySelector("#dateInput").addEventListener("change", function() {
  today = new Date(this.value) || new Date();
  specificDate = true;
  makeScedule(document.querySelector("#nameInput").value);
});

document.querySelector("#nameInput").addEventListener("change", function() {
  if (this.selectedIndex === 0) {
    history.pushState("", "", location.pathname);
  }
  else {
    history.pushState("", "", location.pathname + "?" + "person=" + this.value);
  }
  makeScedule(this.value);
});

// Adding eventlistener for touchevents --------------------------------------------------------------------------------------------------
// Swipe start
c1.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    //just one finger touched
    start = e.touches.item(0).clientX;
  } else {
    //a second finger hit the screen, abort the touch
    start = null;
  }
});

// Swipe active
c1.addEventListener("touchmove", (e) => {

  c0.classList.remove("animate");
  c1.classList.remove("animate");
  c2.classList.remove("animate");
  c1.classList.remove("fade-shadow");
  // c1.style.left = Math.floor(e.touches.item(0).clientX - start) + "px";
  let end = e.touches.item(0).clientX;
  
  if (end > start) {            // a right swipe
    e.preventDefault();
    c0.style.display = "inline-block";
    c0.style.left = "calc(-100% + " + Math.abs(Math.floor(event.touches.item(0).clientX - start)) + "px)";
    c0.classList.add("shadow");
  } else if (end < start) {     // a left swipe
    e.preventDefault();
    c2.style.display = "inline-block";
    c2.style.left = "calc(100% - " + Math.abs(Math.floor(event.touches.item(0).clientX - start)) + "px)";
    c2.classList.add("shadow");
  }
}, true);


// Swipe end
c1.addEventListener("touchend", (e) => {
  
  if (start) {
    // The only finger that hit the screen left it
    let end = e.changedTouches.item(0).clientX;
    let tempDate = new Date(today);

    c0.classList.add("animate");
    c2.classList.add("animate");
    
    // Reset drag
    c0.style.left = "-100%";
    c1.style.left = "0px";
    c2.style.left = "100%";
    
    // A full right swipe
    if (end > start + swipeDist) {
      c0.style.left = "0px";
      specificDate = false;
      if (urlParams.has("person")){
        tempDate.setDate(today.getDate() - (individualWeeksToDisplay * 7));
      } else {
        tempDate.setDate(today.getDate() - (weeksToDisplay * 7));
      }
      
      today = new Date(tempDate);
    } else if (end < start - swipeDist) { // A full left swipe
      specificDate = false;
      c2.style.left = "0px";

      if (urlParams.has("person")) {
        tempDate.setDate(today.getDate() + (individualWeeksToDisplay * 7));
      } else {
        tempDate.setDate(today.getDate() + (weeksToDisplay * 7));
      }
      today = new Date(tempDate);
    }
  }
});

[c0, c2].forEach((ele) => {
  ele.addEventListener("transitionend", () => {
    ele.style.display = "none";
    ele.classList.remove("shadow");
    if (ele.style.left === "0px") {
      c1.classList.add("shadow");
      makeScedule();
      setTimeout(() => {
        c1.classList.add("fade-shadow");
        c1.classList.remove("shadow");
      }, 1);  

    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.height = window.innerHeight + "px";
  document.body.style.overflow = "hidden";
  $('[data-fancybox="gallery_black"]').fancybox({
    afterShow(instance, slide){
      console.log(instance, slide);
    },  
    width: "100%",
    height: "100%",
    loop: true,
    });
    // width : 'auto',
  // $().fancybox({
  // fullScreen: {
  //   autoStart: false
  // }});
});

function clearTables() {
  if (document.querySelector("#current")) {
    document.querySelector("#current").outerHTML = "";
  }
  if (document.querySelector("#previous")) {
    document.querySelector("#previous").outerHTML = "";
  }
  if (document.querySelector("#next")) {
    document.querySelector("#next").outerHTML = "";
  }
}

class Test{
  constructor() {

  }
  doSomething() {

  }
}