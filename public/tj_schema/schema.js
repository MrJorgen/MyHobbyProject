const drivers = ['Janne', 'Daniel', 'Jörgen', 'Sanna', 'Stefan', 'Robin'];

const schema = [
  // Vecka 11
  // Måndag
  [
    {
      '177': drivers[4],
      '172': drivers[5],
      '175': drivers[0],
      '176': drivers[3],
    },
    // Tisdag
    {
      '177': drivers[4],
      '172': drivers[5],
      '175': drivers[0],
      '176': drivers[3],
    },
    // Onsdag
    {
      '177': drivers[2],
      '172': drivers[4],
      '175': drivers[3],
      '176': drivers[1],
    },
    // Torsdag
    {
      '177': drivers[2],
      '172': drivers[5],
      '175': drivers[0],
      '176': drivers[1],
    },
    // Fredag
    {
      '177': drivers[2],
      '172': drivers[5],
      '175': drivers[0],
      '176': drivers[1],
    },
  ],
  // Vecka 12
  // Måndag
  [
    {
      '177': drivers[2],
      '172': drivers[5],
      '175': drivers[0],
      '176': drivers[1],
    },
    // Tisdag
    {
      '177': drivers[2],
      '172': drivers[5],
      '175': drivers[0],
      '176': drivers[1],
    },
    // Onsdag
    {
      '177': drivers[4],
      '172': drivers[5],
      '175': drivers[0],
      '176': drivers[3],
    },
    // Torsdag
    {
      '177': drivers[2],
      '172': drivers[4],
      '175': drivers[3],
      '176': drivers[1],
    },
    // Fredag
    {
      '177': drivers[2],
      '172': drivers[4],
      '175': drivers[3],
      '176': drivers[1],
    },
  ],
  // Vecka 13
  // Måndag
  [
    {
      '177': drivers[2],
      '172': drivers[4],
      '175': drivers[3],
      '176': drivers[1],
    },
    // Tisdag
    {
      '177': drivers[2],
      '172': drivers[4],
      '175': drivers[3],
      '176': drivers[1],
    },
    // Onsdag
    {
      '177': drivers[2],
      '172': drivers[5],
      '175': drivers[0],
      '176': drivers[1],
    },
    // Torsdag
    {
      '172': drivers[5],
      '177': drivers[4],
      '175': drivers[0],
      '176': drivers[3],
    },
    // Fredag
    {
      '177': drivers[4],
      '172': drivers[5],
      '175': drivers[0],
      '176': drivers[3],
    },
  ],
];

export {drivers, schema};
