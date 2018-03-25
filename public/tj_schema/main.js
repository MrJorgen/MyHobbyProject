import {
  drivers,
  schema
} from './schema.js';
// let newSchema;

import {
  craeateSceduleByPerson,
  dateToString
} from './functions.js';

// fetch("./scedule.json")
//     .then(resp => resp.json())
//     .then(resp => {
//         newSchema = resp;
//         makeTable();
//     });

let dayNames = ['Mån', 'Tis', 'Ons', 'Tors', 'Fre'],
  weeksToDisplay = 3,
  width = window.innerWidth,
  schemaStartWeek = 11,
  schemaLength = schema.length;
let today = new Date();
let urlParams = new URLSearchParams(window.location.search);

function makeScedule(person) {
  console.log(person);
  if (urlParams.has('person') || person) {
    // Set selected index in nameSelect
    for (let i = 0; i < document.querySelector('#nameInput').options.length; i++) {
      if (document.querySelector('#nameInput').options[i].text == urlParams.get('person')) {
        document.querySelector('#nameInput').selectedIndex = i;
        break;
      }
    }
    makePersonalScedule(urlParams.get('person') || person);
    return;
  }

  let previous = new Date(today);
  previous.setDate(previous.getDate() - 21);
  let next = new Date(today);
  next.setDate(next.getDate() + 21);

  clearTables();
  // makeTable("previous", previous, 0);
  makeTable('current', today, width);
  // makeTable("next", next, (width * 2));
}

function makeTable(id, currentDay, leftMargin) {
  let currentWeek = currentDay.getWeek();
  if (currentDay.getWeek() < new Date().getWeek()) {
    return;
  }
  let startOfWeek = new Date(currentDay);
  if (startOfWeek.getDay() == 0) {
    startOfWeek.setDate(startOfWeek.getDate() + 1);
    currentWeek++;
  } else if (startOfWeek.getDay() == 6) {
    startOfWeek.setDate(startOfWeek.getDate() + 2);
    currentWeek++;
  } else if (startOfWeek.getDay() > 1 && startOfWeek.getDay() < 6) {
    while (startOfWeek.getDay() > 1) {
      startOfWeek.setDate(startOfWeek.getDate() - 1);
    }
  }

  let schemaTable = document.createElement('table');
  schemaTable.id = id;

  // Start weeks to show loop here
  // ----------------------------------------------------------
  for (let k = 0; k < weeksToDisplay; k++) {
    let tableHeader = document.createElement('thead');
    let weekHeader = document.createElement('tr');
    weekHeader.classList.add('week');

    let weekRow = document.createElement('th');
    weekRow.classList.add('weeknr');
    weekRow.colSpan = 6;
    weekRow.innerHTML = 'Vecka ' + currentWeek;

    weekHeader.appendChild(weekRow);
    tableHeader.appendChild(weekHeader);

    let daysRow = document.createElement('tr');
    tableHeader.appendChild(daysRow);

    // Create header for table
    for (let i = -1; i < dayNames.length; i++) {
      let tmpCell = document.createElement('th');
      if (i < 0) {
        tmpCell.innerText = 'Bil';
      } else {
        tmpCell.innerHTML =
          dayNames[i] +
          `<span class=\"nobold small\">${dateToString(startOfWeek, i)}</span>`;
        if (i == today.getDay() - 1 && currentWeek == today.getWeek()) {
          tmpCell.classList.add('active', 'active-top');
        }
      }
      daysRow.appendChild(tmpCell);
    }

    schemaTable.appendChild(tableHeader);

    let tableBody = document.createElement('tbody');

    // Object.keys(schema[0][0]).length
    // First, iterate through nr of truck
    for (let i = 0; i < Object.keys(schema[0][0]).length; i++) {
      // Create a new row
      let tmpRow = document.createElement('tr');
      if (i == Object.keys(schema[0][0]).length - 1) {
        tmpRow.classList.add('border-bottom');
      }

      // Loop through each day of the week
      // Add header to row
      let tmpCell = document.createElement('th');
      tmpCell.innerText = Object.keys(schema[0][0])[i];
      tmpRow.appendChild(tmpCell);

      // Loop through each day of the trucks scedule
      for (let j = 0; j < schema[0].length; j++) {

        tmpCell = document.createElement('td');
        // tmpCell.innerText = schema[(currentWeek - 1) % 5][j][Object.keys(schema[0][0])[i]];

        // Changing this to correct for new scedule
        tmpCell.innerText = schema[(currentWeek - schemaStartWeek) % schemaLength][j][Object.keys(schema[0][0])[i]];
        if (j == today.getDay() - 1 && currentWeek == today.getWeek()) {
          tmpCell.classList.add('active');
        }
        if (
          j == today.getDay() - 1 &&
          currentWeek == today.getWeek() &&
          i == Object.keys(schema[0][0]).length - 1
        ) {
          tmpCell.classList.add('active-bottom');
        }
        tmpRow.appendChild(tmpCell);
      }

      tableBody.appendChild(tmpRow);
    }
    schemaTable.appendChild(tableBody);
    currentWeek++;
    startOfWeek.setDate(startOfWeek.getDate() + 7);
  }
  // schemaTable.style.marginLeft = leftMargin + "px";
  schemaTable.style.position = 'absolute';
  schemaTable.style.width = width + 'px';
  schemaTable.style.top = '0px';
  // schemaTable.style.float = "left";

  document.querySelector('#container').appendChild(schemaTable);
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
    document.querySelector('#container').innerText =
      'Visa schema för: "' + person + '"';
    craeateSceduleByPerson(person, schema, today);
  } else {
    // Person not found in scedule, aborting
    document.querySelector('#innerContainer').innerText =
      'Person not found: "' + person + '"';
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
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        (week1.getDay() + 6) % 7) /
      7
    )
  );
};

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#dateInput').setAttribute('min', new Date().toISOString().split('T')[0]);
  for (let driver of drivers){
    document.querySelector('#nameInput').add(new Option(driver, driver));
  }
  makeScedule();
});

document.querySelector('#dateInput').addEventListener('change', function () {
  today = new Date(this.value);
  makeScedule();
});

document.querySelector('#nameInput').addEventListener('change', function () {
  // today = new Date(this.value);
  makeScedule(this.value);
});

let start = null;
window.addEventListener('touchstart', function (event) {
  if (event.touches.length === 1) {
    //just one finger touched
    start = event.touches.item(0).clientX;
  } else {
    //a second finger hit the screen, abort the touch
    start = null;
  }
});

window.addEventListener('touchmove', function () {
  document.body.style.marginLeft =
    Math.floor(event.touches.item(0).clientX - start) + 'px';
});

window.addEventListener('touchend', function (event) {
  // Reset drag
  document.body.style.marginLeft = '0px';
  window.scrollTo(0, 0);
  console.log(document.body.scrollLeft);

  //at least 80px are a swipe
  let offset = 80;
  if (start) {
    //the only finger that hit the screen left it
    let end = event.changedTouches.item(0).clientX;

    //a left -> right swipe
    if (end > start + offset) {
      let tempDate = new Date(today);
      tempDate.setDate(today.getDate() - 7);

      if (tempDate.getWeek() >= new Date().getWeek()) {
        today = new Date(tempDate);
        makeScedule();
      }
    } else if (end < start - offset) {
      //a left <- right swipe
      let tempDate = new Date(today);
      tempDate.setDate(today.getDate() + 7);

      if (tempDate.getWeek() <= 50) {
        today = new Date(tempDate);
        makeScedule();
      }
    }
  }
});

document.body.addEventListener('drag', function () {
  console.log('Scrolling...');
});

function clearTables() {
  if (document.querySelector('#current')) {
    document.querySelector('#current').outerHTML = '';
  }
  if (document.querySelector('#previous')) {
    document.querySelector('#previous').outerHTML = '';
  }
  if (document.querySelector('#next')) {
    document.querySelector('#next').outerHTML = '';
  }
}