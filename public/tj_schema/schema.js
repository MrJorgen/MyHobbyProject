const drivers = ['Ingemar', 'Janne', 'Jörgen', 'Thomas', 'Martin'],
  schemaStartDate = new Date("2018-11-12"),
  schema = [
  // 5 veckors rullande schema
  // Vecka 46(1)
  // Måndag 2018-11-12
  [
    {
      '171': drivers[0],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Tisdag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[0]
    },
    // Onsdag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Torsdag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[0],
      '176': drivers[4]
    },
    // Fredag
    {
      '171': drivers[3],
      '172': drivers[0],
      '175': drivers[1],
      '176': drivers[4]
    },
  ],
  // Vecka 47(2)
  // Måndag
  [
    {
      '171': drivers[3],
      '172': drivers[0],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Tisdag
    {
      '171': drivers[0],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Onsdag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[0]
    },
    // Torsdag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Fredag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[0],
      '176': drivers[4]
    },
  ],
  // Vecka 48(3)
  // Måndag
  [
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[0],
      '176': drivers[4]
    },
    // Tisdag
    {
      '171': drivers[3],
      '172': drivers[0],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Onsdag
    {
      '171': drivers[0],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Torsdag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[0]
    },
    // Fredag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
  ],
  // Vecka 49(4)
  // Måndag
  [
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Tisdag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[0],
      '176': drivers[4]
    },
    // Onsdag
    {
      '171': drivers[3],
      '172': drivers[0],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Torsdag
    {
      '171': drivers[0],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Fredag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[0]
    },
  ],
  // Vecka 50(5)
  // Måndag
  [
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[0]
    },
    // Tisdag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Onsdag
    {
      '171': drivers[3],
      '172': drivers[2],
      '175': drivers[0],
      '176': drivers[4]
    },
    // Torsdag
    {
      '171': drivers[3],
      '172': drivers[0],
      '175': drivers[1],
      '176': drivers[4]
    },
    // Fredag
    {
      '171': drivers[0],
      '172': drivers[2],
      '175': drivers[1],
      '176': drivers[4]
    },
  ],
];

export {drivers, schemaStartDate, schema};
