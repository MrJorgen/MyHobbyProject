export let levels = [
  {
    // level: 1,
    scaredFlashes: 5,
    scaredDuration: 6000,
    pacSpeed: 0.8,
    ghostSpeed: 0.75,
    modes: [
      { duration: 7, mode: "scatter", start: 0 },
      { duration: 20, mode: "chase", start: 0 },
      { duration: 7, mode: "scatter", start: 0 },
      { duration: 20, mode: "chase", start: 0 },
      { duration: 5, mode: "scatter", start: 0 },
      { duration: 20, mode: "chase", start: 0 },
      { duration: 5, mode: "scatter", start: 0 },
      { duration: Infinity, mode: "chase", start: 0 }
    ]
  },
  {
    // level: (> 1 && < 5),
    scaredFlashes: 5,
    scaredDuration: 6000,
    pacSpeed: 0.8,
    ghostSpeed: 0.75,
    modes: [
      { duration: 7, mode: "scatter", start: 0 },
      { duration: 20, mode: "chase", start: 0 },
      { duration: 7, mode: "scatter", start: 0 },
      { duration: 20, mode: "chase", start: 0 },
      { duration: 5, mode: "scatter", start: 0 },
      { duration: 1033, mode: "chase", start: 0 },
      { duration: 1/60, mode: "scatter", start: 0 },
      { duration: Infinity, mode: "chase", start: 0 }
    ]
  }
]