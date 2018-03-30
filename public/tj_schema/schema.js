const drivers = ['Janne', 'Jörgen', 'Sanna', 'Stefan'];

const schema = [
  // Vecka 14
  // Måndag
  [
    {
      '175': drivers[2],
      '176': drivers[3],
      '177': drivers[1],
    },
    // Tisdag
    {
      '175': drivers[0],
      '176': drivers[3],
      '177': drivers[1],
    },
    // Onsdag
    {
      '175': drivers[0],
      '176': drivers[3],
      '177': drivers[2],
    },
    // Torsdag
    {
      '175': drivers[0],
      '176': drivers[2],
      '177': drivers[1],
    },
    // Fredag
    {
      '175': drivers[0],
      '176': drivers[2],
      '177': drivers[1],
    },
  ],
  // Vecka 15
  // Måndag
  [
    {
      '175': drivers[0],
      '176': drivers[2],
      '177': drivers[1],
    },
    // Tisdag
    {
      '175': drivers[2],
      '176': drivers[3],
      '177': drivers[1],
    },
    // Onsdag
    {
      '175': drivers[0],
      '176': drivers[3],
      '177': drivers[1],
    },
    // Torsdag
    {
      '175': drivers[0],
      '176': drivers[3],
      '177': drivers[2],
    },
    // Fredag
    {
      '175': drivers[0],
      '176': drivers[3],
      '177': drivers[2],
    },
  ],
  // Vecka 16
  // Måndag
  [
    {
      '175': drivers[0],
      '176': drivers[3],
      '177': drivers[2],
    },
    // Tisdag
    {
      '175': drivers[0],
      '176': drivers[2],
      '177': drivers[1],
    },
    // Onsdag
    {
      '175': drivers[2],
      '176': drivers[3],
      '177': drivers[1],
    },
    // Torsdag
    {
      '175': drivers[0],
      '176': drivers[3],
      '177': drivers[1],
    },
    // Fredag
    {
      '175': drivers[0],
      '176': drivers[3],
      '177': drivers[1],
    },
  ],
  // Vecka 17
  // Måndag
  [
    {
      '175': drivers[0],
      '176': drivers[2],
      '177': drivers[1],
    },
    // Tisdag
    {
      '175': drivers[0],
      '176': drivers[3],
      '177': drivers[2],
    },
    // Onsdag
    {
      '175': drivers[0],
      '176': drivers[2],
      '177': drivers[1],
    },
    // Torsdag
    {
      '175': drivers[2],
      '176': drivers[3],
      '177': drivers[1],
    },
    // Fredag
    {
      '177': drivers[2],
      '175': drivers[3],
      '176': drivers[1],
    },
  ],
];

export {drivers, schema};
