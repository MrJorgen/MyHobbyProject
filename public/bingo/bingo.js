let btn = document.querySelector("#newBtn");
btn.addEventListener("click", start);
let col1 = [], col2 = [], col3 = [], col4 = [], col5 = [],
  numbers = Array.from({ length: 75 }, (e, i) => i + 1),
  usedNumbers = [], bingo = false, running = false, show = null;

init();

function init() {
  img = Math.floor(Math.random() * 6);
  usedNumbers = [];
  numbers = Array.from({ length: 75 }, (e, i) => i + 1);
  bingo = false;
  show = null;

  document.querySelector("#usedNrs").innerHTML = "";
  let table = document.querySelector("#maintable");


  for (let i = 0; i < 15; i++) {
    table.rows[i + 1].classList.remove("bingo");
    col1[i] = i + 1;
    col2[i] = i + 16;
    col3[i] = i + 31;
    col4[i] = i + 46;
    col5[i] = i + 61;
  }
  
  scramble(col1);
  scramble(col2);
  scramble(col3);
  scramble(col4);
  scramble(col5);
  scramble(numbers);
  
  fillTable();
}

function fillTable() {
  let table = document.querySelector("#maintable");
  for (let i = 0; i < 15; i++) {
    table.rows[i + 1].cells[0].innerHTML = col1[i];
    table.rows[i + 1].cells[0].className = "";
    table.rows[i + 1].cells[1].innerHTML = col2[i];
    table.rows[i + 1].cells[1].className = "";
    table.rows[i + 1].cells[2].innerHTML = col3[i];
    table.rows[i + 1].cells[2].className = "";
    table.rows[i + 1].cells[3].innerHTML = col4[i];
    table.rows[i + 1].cells[3].className = "";
    table.rows[i + 1].cells[4].innerHTML = col5[i];
    table.rows[i + 1].cells[4].className = "";
  }
}

function scramble(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function markNumber(nr) {
  let table = document.querySelector("#maintable"), col = Math.floor((nr - 1) / 15);
  for (let i = 0; i < 15; i++) {
    if (table.rows[i + 1].cells[col].innerHTML == nr) {
      
      table.rows[i + 1].cells[col].classList.add("marked", "img" + img);

      if (checkForBingo(i + 1, table)) {
        bingo = true;
        console.log(table.rows[i + 1].cells[col]);
        table.rows[i + 1].cells[col].parentElement.classList.add("bingo");
        console.log("Bingo at round " + usedNumbers.length);
      };
      return;
    }
  }
}

function checkForBingo(row, table) {
  for (let i = 0; i <= 4; i++) {
    if (!usedNumbers.includes(parseInt(table.rows[row].cells[i].innerHTML))) {
      return false;
    }
  }
  return true;
}

function start() {
  let restart = false;
  if (!running && bingo) {
    init();
    restart = true;
  }
  if (!running && !bingo) {
    if (!restart) {
      newNr();
      show = setInterval(newNr, 4000);
    } else {
      setTimeout(() => {
        newNr();
        show = setInterval(newNr, 4000);
      }, 1000);
    }
    running = true;
    document.querySelector("#newBtn").innerText = "Pause";
  } else {
    clearInterval(show);
    running = false;
    document.querySelector("#newBtn").innerText = "Start";
  }
}

function newNr() {
  if (numbers.length > 0 && !bingo) {
    usedNumbers.push(numbers.shift());
    markNumber(usedNumbers[usedNumbers.length - 1]);
    let newNr = document.createElement("div");
    newNr.innerText = usedNumbers[usedNumbers.length - 1];
    newNr.classList.add("usedNumbers");
    document.querySelector("#usedNrs").appendChild(newNr);
  }
  else {
    clearInterval(show);
    document.querySelector("#newBtn").innerText = "Restart";
    // document.querySelector("#newBtn").disabled = true;
    running = false;
  }
}