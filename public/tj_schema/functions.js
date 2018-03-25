export {craeateSceduleByPerson, dateToString};

function craeateSceduleByPerson (name, scedule, today) {
  let schemaStartWeek = 11, schemaLength = scedule.length;
  let personalScedule = JSON.parse (JSON.stringify (scedule));

  // Loop weeks
  for (let i = 0; i < scedule.length; i++) {
    // Loop days
    for (let j = 0; j < scedule[i].length; j++) {
      // Loop trucks and set defualt value to "Ledig"
      personalScedule[i][j] = 'Ledig';
      for (let truck in scedule[i][j]) {
        // Add truck if person is found
        if (scedule[i][j][truck] == name) {
          personalScedule[i][j] = truck;
        }
      }
    }
  }

  let currentDay = new Date (today),
    startOfWeek = new Date (currentDay),
    currentWeek = currentDay.getWeek ();
  if (startOfWeek.getDay () == 0) {
    startOfWeek.setDate (startOfWeek.getDate () + 1);
    currentWeek++;
  } else if (startOfWeek.getDay () == 6) {
    startOfWeek.setDate (startOfWeek.getDate () + 2);
    currentWeek++;
  } else if (startOfWeek.getDay () > 1 && startOfWeek.getDay () < 6) {
    while (startOfWeek.getDay () > 1) {
      startOfWeek.setDate (startOfWeek.getDate () - 1);
    }
  }

  // From here on make the output
  let template = `
    <table id="current" style="position: absolute; top: 0px;">
      <thead>
        <tr class="week">
          <th class="weeknr" colspan="6">${name}s schema</th>
        </tr>
        <tr>
          <th>Vecka</th>
          <th>Mån<span class=\"nobold small\"> ${dateToString (startOfWeek, 0)}</span></th>
          <th>Tis<span class=\"nobold small\"> ${dateToString (startOfWeek, 1)}</span></th>
          <th>Ons<span class=\"nobold small\"> ${dateToString (startOfWeek, 2)}</span></th>
          <th>Tors<span class=\"nobold small\"> ${dateToString (startOfWeek, 3)}</span></th>
          <th>Fre<span class=\"nobold small\"> ${dateToString (startOfWeek, 4)}</span></th>
        </tr>
      </thead>
      <tbody>`;

  for (let i = 0; i < 8; i++) {
    if (i > 0) {
      template += `
          <tr class="border-top">
            <th></th>
            <th>Mån<span class=\"nobold small\"> ${dateToString (startOfWeek, i * 7)}</span></th>
            <th>Tis<span class=\"nobold small\"> ${dateToString (startOfWeek, i * 7 + 1)}</span></th>
            <th>Ons<span class=\"nobold small\"> ${dateToString (startOfWeek, i * 7 + 2)}</span></th>
            <th>Tors<span class=\"nobold small\"> ${dateToString (startOfWeek, i * 7 + 3)}</span></th>
            <th>Fre<span class=\"nobold small\"> ${dateToString (startOfWeek, i * 7 + 4)}</span></th>
          </tr>
        `;
    }

    template += `
        <tr class="border-bottom"><th>${currentWeek}</th>`;

    for (
      let j = 0;
      j <
      personalScedule[
        (startOfWeek.getWeek () - schemaStartWeek + i) % schemaLength
      ].length;
      j++
    ) {
      let tmpStr =
        personalScedule[
          (startOfWeek.getWeek () - schemaStartWeek + i) % schemaLength
        ][j];
      if (tmpStr == 'Ledig') {
        template += `<td class="red">${tmpStr}</td>`;
      } else {
        template += `<td>${tmpStr}</td>`;
      }
    }
    template += '</tr>';
    currentWeek++;
  }

  template += '</tbody ></table>';
  document.querySelector ('#container').innerHTML = template;
}

function dateToString (currentDate, offSet = 0) {
  let tmpDate = new Date (currentDate);
  tmpDate.setDate (tmpDate.getDate () + offSet);
  return tmpDate.getDate () + '/' + (tmpDate.getMonth () + 1);
}
