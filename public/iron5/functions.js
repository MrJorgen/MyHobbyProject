export { craeateSceduleByPerson, dateToString };
import { schemaStartDate } from './schema.js';


function craeateSceduleByPerson(name, scedule, today) {
  let schemaLength = scedule.length,
    personalScedule = JSON.parse(JSON.stringify(scedule)), individualWeeksToDisplay = 8;

  // Loop weeks
  for(let i = 0; i < scedule.length; i++) {
    // Loop days
    for(let j = 0; j < scedule[i].length; j++) {
      // Loop trucks and set defualt value to "Ledig"
      personalScedule[i][j] = 'Ledig';
      for(let truck in scedule[i][j]) {
        // Add truck if person is found
        if(scedule[i][j][truck] == name) {
          personalScedule[i][j] = truck;
        }
      }
    }
  }

  let currentDay = new Date(today), startOfWeek = new Date(currentDay);
  // Find out if it's weekend, if so display next week
  if(startOfWeek.getDay() == 0) {
    startOfWeek.setDate(startOfWeek.getDate() + 1);
    currentDay.setDate(currentDay.getDate() + 7);
  } else if (startOfWeek.getDay() == 6) {
    startOfWeek.setDate(startOfWeek.getDate () + 2);
    currentDay.setDate(currentDay.getDate() + 7);
  } else if (startOfWeek.getDay() > 1 && startOfWeek.getDay() < 6) {
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  }

  // From here on make the output
  let template = `
    <table id="current">
      <thead>
        <tr class="week">
          <th class="weeknr" colspan="7">Schema för ${name}</th>
        </tr>
        <tr>
          <th>V</th>
          <th>Mån<span class=\"nobold small\"> ${dateToString(startOfWeek, 0)}</span></th>
          <th>Tis<span class=\"nobold small\"> ${dateToString(startOfWeek, 1)}</span></th>
          <th>Ons<span class=\"nobold small\"> ${dateToString(startOfWeek, 2)}</span></th>
          <th>Tors<span class=\"nobold small\"> ${dateToString(startOfWeek, 3)}</span></th>
          <th>Fre<span class=\"nobold small\"> ${dateToString(startOfWeek, 4)}</span></th>
          <th>Lör<span class=\"nobold small\"> ${dateToString(startOfWeek, 5)}</span></th>
        </tr>
      </thead>
      <tbody>`;

  for (let i = 0; i < individualWeeksToDisplay; i++) {
    if (i > 0) {
      template += `
          <tr class="border-top">
            <th></th>
            <th>Mån<span class=\"nobold small\"> ${dateToString(startOfWeek, i * 7)}</span></th>
            <th>Tis<span class=\"nobold small\"> ${dateToString(startOfWeek, i * 7 + 1)}</span></th>
            <th>Ons<span class=\"nobold small\"> ${dateToString(startOfWeek, i * 7 + 2)}</span></th>
            <th>Tors<span class=\"nobold small\"> ${dateToString(startOfWeek, i * 7 + 3)}</span></th>
            <th>Fre<span class=\"nobold small\"> ${dateToString(startOfWeek, i * 7 + 4)}</span></th>
            <th>Lör<span class=\"nobold small\"> ${dateToString(startOfWeek, i * 7 + 5)}</span></th>
          </tr>
        `;
    }

    template += `
        <tr class="border-bottom"><th>${currentDay.getWeek()}</th>`;
    
    let weekMillis = 1000 * 60 * 60 * 24 * 7;
    let weekDiff = Math.floor((currentDay - schemaStartDate) / weekMillis);

    for (let j = 0; j < personalScedule[(weekDiff) % schemaLength].length; j++) {
      let tmpStr = personalScedule[(weekDiff) % schemaLength][j];
      if (tmpStr == 'Ledig') {
        template += `<td class="red">${tmpStr}</td>`;
      } else {
        template += `<td>${tmpStr}</td>`;
      }
    }
    template += '</tr>';
    currentDay.setDate(currentDay.getDate() + 7);
  }

  template += '</tbody ></table>';
  document.querySelector('#container').innerHTML = template;
}

function dateToString(currentDate, offSet = 0) {
  let tmpDate = new Date(currentDate);
  tmpDate.setDate(tmpDate.getDate() + offSet);
  return tmpDate.getDate() + '/' + (tmpDate.getMonth() + 1);
}