export function getHolidays(date) {
  const Y = date.getFullYear();
  const holidays = [
    {name: "Nyårsdagen", isRed: true, isFlagDay: true, date: new Date(Y, 0, 1)},
    {name: "Konungens namnsdag", isRed: false, isFlagDay: true, date: new Date(Y, 0, 28)},
    {name: "Kronprinsessans namnsdag", isRed: false, isFlagDay: true, date: new Date(Y, 2, 12)},
    {name: "Konungens födelsedag", isRed: false, isFlagDay: true, date: new Date(Y, 3, 30)},
    {name: "Veterandagen", isRed: false, isFlagDay: true, date: new Date(Y, 4, 29)},
    {name: "Kronprinsessans födelsedag", isRed: false, isFlagDay: true, date: new Date(Y, 6, 14)},
    {name: "Drottningens namnsdag", isRed: false, isFlagDay: true, date: new Date(Y, 7, 8)},
    {name: "FN-dagen", isRed: false, isFlagDay: true, date: new Date(Y, 9, 24)},
    {name: "Gustav Adolfdagen", isRed: false, isFlagDay: true, date: new Date(Y, 10, 6)},
    {name: "Nobeldagen", isRed: false, isFlagDay: true, date: new Date(Y, 11, 10)},
    {name: "Drottningens födelsedag", isRed: false, isFlagDay: true, date: new Date(Y, 11, 23)},
    {name: "Trettondedag Jul", isRed: true, date: new Date(Y, 0, 6)},
    {name: "Valborsmässoafton", isRed: false, date: new Date(Y, 3, 30)},
    {name: "1:a maj", isRed: true, isFlagDay: true, date: new Date(Y, 4, 1)},
    {name: "Nationaldagen", isRed: true, isFlagDay: true, date: new Date(Y, 5, 6)},
    {name: "Julafton", isRed: false, date: new Date(Y, 11, 24)},
    {name: "Juldagen", isRed: true, isFlagDay: true, date: new Date(Y, 11, 25)},
    {name: "Annandag Jul", isRed: true, date: new Date(Y, 11, 26)},
    {name: "Allhelgonadagen", isRed: false, date: new Date(Y, 10, 1)},
    {name: "Alla Hjärtans dag", isRed: false, date: new Date(Y, 1, 14)},
  ];

  // Alla dagar relaterade till påsk
  let C = Math.floor(Y / 100);
  let N = Y - 19 * Math.floor(Y / 19);
  let K = Math.floor((C - 17) / 25);
  let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I = I - 30 * Math.floor(I / 30);
  I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
  let J = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
  J = J - 7 * Math.floor(J / 7);
  let L = I - J;
  let M = 3 + Math.floor((L + 40) / 44);
  let D = L + 28 - 31 * Math.floor(M / 4);

  holidays.push({name: "Fastlagssöndagen", isRed: false, date: new Date(Y, M - 1, D - 49)});
  holidays.push({name: "Fettisdagen", isRed: false, date: new Date(Y, M - 1, D - 47)});
  holidays.push({name: "Askonsdagen ", isRed: false, date: new Date(Y, M - 1, D - 46)});
  holidays.push({name: "Skärtorsdag", isRed: false, date: new Date(Y, M - 1, D - 3)});
  holidays.push({name: "Långfredagen", isRed: true, date: new Date(Y, M - 1, D - 2)});
  holidays.push({name: "Påskafton", isRed: false, date: new Date(Y, M - 1, D - 1)});
  holidays.push({name: "Påskdagen", isRed: true, isFlagDay: true, date: new Date(Y, M - 1, D)});
  holidays.push({name: "Annandag påsk", isRed: true, date: new Date(Y, M - 1, D + 1)});
  holidays.push({name: "Kristi Himmelsfärdsdag", isRed: true, date: new Date(Y, M - 1, D + 39)});
  holidays.push({name: "Pingstafton", isRed: false, date: new Date(Y, M - 1, D + 48)});
  holidays.push({name: "Pingstdagen", isRed: true, isFlagDay: true, date: new Date(Y, M - 1, D + 49)});

  // Midsommar

  let dayOfMonth = 19,
    midsummersEve = new Date(Y, 5, dayOfMonth);
  while (midsummersEve.getDay() !== 5) {
    dayOfMonth++;
    midsummersEve = new Date(Y, 5, dayOfMonth);
  }

  holidays.push({name: "Midsommarafton", isRed: false, date: midsummersEve});
  holidays.push({name: "Midsommardagen", isRed: true, isFlagDay: true, date: new Date(midsummersEve.getFullYear(), midsummersEve.getMonth(), midsummersEve.getDate() + 1)});

  // Alla Helgons dag
  dayOfMonth = 31;
  let allaHelgonsDag = new Date(Y, 9, dayOfMonth);
  while (allaHelgonsDag.getDay() !== 6) {
    dayOfMonth++;
    allaHelgonsDag = new Date(Y, 9, dayOfMonth);
  }

  holidays.push({name: "Alla Helgons dag", isRed: true, date: allaHelgonsDag});

  // Advent
  dayOfMonth = 24;
  let advent4 = new Date(Y, 11, dayOfMonth);
  while (advent4.getDay() !== 0) {
    dayOfMonth--;
    advent4 = new Date(Y, 11, dayOfMonth);
  }

  holidays.push({name: "1:a Advent", isRed: true, date: new Date(Y, 11, dayOfMonth - 21)});
  holidays.push({name: "2:a Advent", isRed: true, date: new Date(Y, 11, dayOfMonth - 14)});
  holidays.push({name: "3:e Advent", isRed: true, date: new Date(Y, 11, dayOfMonth - 7)});
  holidays.push({name: "4:e Advent", isRed: true, date: new Date(Y, 11, dayOfMonth)});

  return holidays;
}

/*
Information tagen från: https://svenskahogtider.com/2014/12/30/vilka-dagar-ar-roda-dagar-i-sverige/

Förutom söndagar och de helgdagar som infaller på en söndag (alltså påskdagen och pingstdagen) är
elva dagar i Sverige allmänna helgdagar.

Dagar har försvunnit och andra har lagts till, men från 2005(då Annandag Pingst försvann och
Nationaldagen lades till) är följande datum plus alla söndagar, alltså även påskdagen och
pingstdagen helgdag i Sverige:

Allhelgonadagen (1 november) är en namngiven dag men inte röd

Alla helgons dag är lördagen som infaller mellan 31 oktober och 6 november och är en röd dag

Nyårsdagen
Trettondedag jul
Långfredagen
Annandag påsk
Första maj
Kristi himmelsfärdsdag
Nationaldagen
Midsommardagen
Alla helgons dag
Juldagen
Annandag jul

Övrigt:

Alla Hjärtans dag: den 14 februari
Fars dag: den andra söndagen i november. 
Mors dag: den sista söndagen i maj
Valborgsmässoafton: Infaller alltid den 30 april.

*/
