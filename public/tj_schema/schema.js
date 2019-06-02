const drivers = ["Dennis", "Ingemar", "Janne", "Jörgen", "Emma", "Martin", "Sanna"],
  trucks = ["171", "172", "175", "176", "177"],
  schemaStartDate = new Date("2019-06-03"),
  schema = [
    // 7 veckors rullande schema
    // Vecka 23(1)
    // Måndag 2019-06-03
    [
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[1],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Tisdag
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[1],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Onsdag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[3],
      },
      // Torsdag
      {
        "171": drivers[1],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Fredag
      {
        "171": drivers[1],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
    ],
    // Vecka 24(2)
    // Måndag
    [
      {
        "171": drivers[3],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
      // Tisdag
      {
        "171": drivers[3],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
      // Onsdag
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[1],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Torsdag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[3],
      },
      // Fredag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[3],
      },
    ],
    // Vecka 25(3)
    // Måndag
    [
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Tisdag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Onsdag
      {
        "171": drivers[3],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
      // Torsdag
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[1],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Fredag
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[1],
        "176": drivers[5],
        "177": drivers[6],
      },
    ],
    // Vecka 26(4)
    // Måndag
    [
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[3],
        "176": drivers[5],
        "177": drivers[1],
      },
      // Tisdag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[3],
        "176": drivers[5],
        "177": drivers[1],
      },
      // Onsdag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Torsdag
      {
        "171": drivers[3],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
      // Fredag
      {
        "171": drivers[3],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
    ],
    // Vecka 27(5)
    // Måndag
    [
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
      // Tisdag
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
      // Onsdag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[1],
        "176": drivers[5],
        "177": drivers[3],
      },
      // Torsdag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Fredag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
    ],
    // Vecka 28(6)
    // Måndag
    [
      {
        "171": drivers[3],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Tisdag
      {
        "171": drivers[3],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Onsdag
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
      // Torsdag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[1],
        "176": drivers[5],
        "177": drivers[3],
      },
      // Fredag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[1],
        "176": drivers[5],
        "177": drivers[3],
      },
    ],
    // Vecka 29(7)
    // Måndag
    [
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[3],
      },
      // Tisdag
      {
        "171": drivers[4],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[3],
      },
      // Onsdag
      {
        "171": drivers[1],
        "172": drivers[0],
        "175": drivers[2],
        "176": drivers[5],
        "177": drivers[6],
      },
      // Torsdag
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
      // Fredag
      {
        "171": drivers[4],
        "172": drivers[3],
        "175": drivers[2],
        "176": drivers[1],
        "177": drivers[6],
      },
    ],
  ];

export { drivers, schemaStartDate, schema };
