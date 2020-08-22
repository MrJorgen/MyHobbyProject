const drivers = [ "Jörgen", "Mogge", "Ronny"],
  trucks = ["Ner", "Upp"],
  schemaStartDate = new Date("2020-02-03"),
  schema = [
    // 3 veckors rullande schema
    // Vecka 23(1)
    // Måndag 2019-06-03
    [
      {
        "Upp": drivers[1],
        "Ner": drivers[0],
      },
      // Tisdag
      {
        "Upp": drivers[1],
        "Ner": drivers[0],
      },
      // Onsdag
      {
        "Upp": drivers[1],
        "Ner": drivers[0],
      },
      // Torsdag
      {
        "Upp": drivers[2],
        "Ner": drivers[0],
      },
      // Fredag
      {
        "Upp": drivers[2],
      },
      // Lördag
      {
        "Ner": drivers[0],
      },
    ],
    // Vecka 24(2)
    // Måndag
    [
      {
        "Upp": drivers[0],
        "Ner": drivers[2],
      },
      // Tisdag
      {
        "Upp": drivers[0],
        "Ner": drivers[2],
      },
      // Onsdag
      {
        "Upp": drivers[0],
        "Ner": drivers[2],
      },
      // Torsdag
      {
        "Upp": drivers[1],
        "Ner": drivers[2],
      },
      // Fredag
      {
        "Upp": drivers[1],
      },
      // Lördag
      {
        "Ner": drivers[2],
      }
    ],
    // Vecka 25(3)
    // Måndag
    [
      {
        "Upp": drivers[2],
        "Ner": drivers[1],
      },
      // Tisdag
      {
        "Upp": drivers[2],
        "Ner": drivers[1],
      },
      // Onsdag
      {
        "Upp": drivers[2],
        "Ner": drivers[1],
      },
      // Torsdag
      {
        "Upp": drivers[0],
        "Ner": drivers[1],
      },
      // Fredag
      {
        "Upp": drivers[0],
      },
      // Lördag
      {
        "Ner": drivers[1],
      }
    ]
  ];

export { drivers, schemaStartDate, schema };
