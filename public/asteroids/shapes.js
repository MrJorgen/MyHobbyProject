const shapes = {
    ship: {
        body: {
            scale: 10,
            points: [
                { x: 4, y: 0 },
                { x: -4, y: -3 },
                { x: -2, y: 0 },
                { x: -4, y: 3 },
            ],
        },

        thrust: {
            scale: 1,
            points: [
                { x: -29, y: -14 },
                { x: -55, y: 0 },
                { x: -29, y: 14 },
                { x: -20, y: 0 },
            ],
        },

        bullet: {
            fill: true,
            scale: 4,
            points: [
                { x: -1, y: -3 },
                { x: 0, y: -3 },
                { x: 1, y: -3 },
                { x: 2, y: -2 },
                { x: 3, y: -1 },
                { x: 3, y: 0 },
                { x: 3, y: 1 },
                { x: 2, y: 2 },
                { x: 1, y: 3 },
                { x: 0, y: 3 },
                { x: -1, y: 3 },
                { x: -2, y: 2 },
                { x: -3, y: 1 },
                { x: -3, y: 0 },
                { x: -3, y: -1 },
                { x: -2, y: -2 },
                { x: -1, y: -3 }

                // { x: -1, y: -2 },
                // { x: 0, y: -2 },
                // { x: 1, y: -2 },
                // { x: 2, y: -1 },
                // { x: 2, y: 0 },
                // { x: 2, y: 1 },
                // { x: 1, y: 2 },
                // { x: 0, y: 2 },
                // { x: -1, y: 2 },
                // { x: -2, y: 1 },
                // { x: -2, y: 0 },
                // { x: -2, y: -1 }
            ],
        },
    },
    saucer: {
        scale: 10,
        points: [
            { x: -2, y: -4 }, // 1
            { x: -4, y: -1 }, // 2
            { x: -7, y: 1 }, // 3
            { x: -5, y: 4 }, // 4
            { x: 5, y: 4 }, // 5
            { x: 7, y: 1 }, // 6
            { x: 4, y: -1 }, // 7
            { x: 2, y: -4 }, // 8
        ],
        lines: [
            [
                { x: 4, y: -1 }, // 7
                { x: -4, y: -1 }, // 2
            ],
            [
                { x: 7, y: 1 }, // 7
                { x: -7, y: 1 }, // 2
            ]
        ],
    },


    asteroids: [{
        scale: 25,
        points: [
            { x: -4, y: -2, },
            { x: -2, y: -4, },
            { x: 2, y: -4, },
            { x: 4, y: -2, },
            { x: 4, y: 2, },
            { x: 2, y: 4, },
            { x: -2, y: 4, },
            { x: -4, y: 2, },
            { x: -4, y: -2 }
        ],
    },
    {
        scale: 25,
        points: [
            { x: -1, y: -2, },
            { x: -2, y: -4, },
            { x: 1, y: -4, },
            { x: 4, y: -2, },
            { x: 4, y: -1, },
            { x: 1, y: 0, },
            { x: 4, y: 2, },
            { x: 2, y: 4, },
            { x: 1, y: 3, },
            { x: -2, y: 4, },
            { x: -4, y: 1, },
            { x: -4, y: -2, },
            { x: -1, y: -2 }
        ],
    },
    {
        scale: 25,
        points: [
            { x: -2, y: 0, },
            { x: -4, y: -1, },
            { x: -1, y: -4, },
            { x: 2, y: -4, },
            { x: 4, y: -1, },
            { x: 4, y: 1, },
            { x: 2, y: 4, },
            { x: 0, y: 4, },
            { x: 0, y: 1, },
            { x: -2, y: 4, },
            { x: -4, y: 1, },
            { x: -2, y: 0 }
        ],
    },
    {
        scale: 25,
        points: [
            { x: -3, y: 0, },
            { x: -4, y: -2, },
            { x: -2, y: -4, },
            { x: 0, y: -3, },
            { x: 2, y: -4, },
            { x: 4, y: -2, },
            { x: 2, y: -1, },
            { x: 4, y: 1, },
            { x: 2, y: 4, },
            { x: -1, y: 3, },
            { x: -2, y: 4, },
            { x: -4, y: 2, },
            { x: -3, y: 0 }
        ],
    },
    {
        scale: 25,
        points: [
            { x: -4, y: -2, },
            { x: -2, y: -4, },
            { x: 0, y: -2, },
            { x: 2, y: -4, },
            { x: 4, y: -2, },
            { x: 3, y: 0, },
            { x: 4, y: 2, },
            { x: 1, y: 4, },
            { x: -2, y: 4, },
            { x: -4, y: 2, },
            { x: -4, y: -2 }
        ],
    },

    {
        scale: 1,
        points: [
            { x: 0, y: 100 }, // corner index 0
            { x: 80, y: 60 }, // corner index 1
            { x: 100, y: -40 }, // corner index 2
            { x: 40, y: -20 }, // corner index 3
            { x: 60, y: -60 }, // corner index 4
            { x: 0, y: -100 }, // corner index 5
            { x: -100, y: -30 }, // corner index 6
            { x: -100, y: 50 }, // corner index 7
        ],
    },
    {
        scale: 1,
        points: [
            { x: 0, y: 100 }, // corner index 0
            { x: 80, y: 60 }, // corner index 1
            { x: 100, y: -40 }, // corner index 2
            { x: 40, y: -20 }, // corner index 3
            { x: 60, y: -60 }, // corner index 4
            { x: 0, y: -100 }, // corner index 5
            { x: -80, y: -80 }, // corner index 6
            { x: -60, y: -30 }, // corner index 7
            { x: -80, y: -40 }, // corner index 8
            { x: -100, y: 50 }, // corner index 9
        ],
    },
    {
        scale: 1,
        points: [
            { x: -40, y: 100 }, // corner index 0
            { x: 10, y: 80 }, // corner index 1
            { x: 70, y: 100 }, // corner index 2
            { x: 100, y: -40 }, // corner index 3
            { x: 40, y: -20 }, // corner index 4
            { x: 60, y: -60 }, // corner index 5
            { x: 0, y: -100 }, // corner index 6
            { x: -100, y: -30 }, // corner index 7
            { x: -100, y: 50 }, // corner index 8
        ],
    },
    {
        scale: 1,
        points: [
            { x: -80, y: 100 }, // corner index 0
            { x: 70, y: 80 }, // corner index 1
            { x: 100, y: -20 }, // corner index 2
            { x: 60, y: -100 }, // corner index 3
            { x: -20, y: -80 }, // corner index 4
            { x: -60, y: -100 }, // corner index 5
            { x: -100, y: -60 }, // corner index 6
            { x: -70, y: 0 }, // corner index 7
        ],
    },
    {
        scale: 1,
        points: [
            { x: -27.7, y: -100 }, // corner index 0
            { x: 44.4, y: -100 }, // corner index 1
            { x: 100, y: -27.7 }, // corner index 2
            { x: 100, y: 33.3 }, // corner index 3
            { x: 44.4, y: 100 }, // corner index 4
            { x: 0, y: 100 }, // corner index 5
            { x: 0, y: 33.3 }, // corner index 6
            { x: -55.5, y: 100 }, // corner index 7
            { x: -100, y: 33.3 }, // corner index 8
            { x: -61, y: 5.5 }, // corner index 9
            { x: -100, y: -22.2 }, // corner index 10
        ],
    }
    ],
    alphabet: {
        A: {
            closedPath: true,
            points: [
                { x: 0, y: -3 },
                { x: -2, y: -1 },
                { x: -2, y: 3 },
                { x: -2, y: 1 },
                { x: 2, y: 1 },
                { x: 2, y: 3 },
                { x: 2, y: -1 },
            ],
        },
        B: {
            closedPath: true,
            points: [
                { x: 1, y: 0 },
                { x: 2, y: -1 },
                { x: 2, y: -2 },
                { x: 1, y: -3 },
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: 1, y: 3 },
                { x: 2, y: 2 },
                { x: 2, y: 1 },
                { x: 1, y: 0 },
                { x: -2, y: 0 },
            ],
        },
        C: {
            closedPath: false,
            points: [
                { x: 2, y: -3 },
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: 2, y: 3 }
            ]
        },
        D: {
            closedPath: true,
            points: [
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: 0, y: 3 },
                { x: 2, y: 1 },
                { x: 2, y: -1 },
                { x: 0, y: -3 },
                { x: -2, y: -3 }
            ],
        },
        E: {
            closedPath: false,
            points: [
                { x: 2, y: -3 },
                { x: -2, y: -3 },
                { x: -2, y: 0 },
                { x: 1, y: 0 },
                { x: -2, y: 0 },
                { x: -2, y: 3 },
                { x: 2, y: 3 }
            ],
        },
        F: {
            closedPath: false,
            points: [
                { x: 2, y: -3 },
                { x: -2, y: -3 },
                { x: -2, y: 0 },
                { x: 1, y: 0 },
                { x: -2, y: 0 },
                { x: -2, y: 3 },
            ],
        },
        G: {
            closedPath: false,
            points: [
                { x: 2, y: -1 },
                { x: 2, y: -3 },
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: 2, y: 3 },
                { x: 2, y: 1 },
                { x: 0, y: 1 }
            ],
        },
        H: {
            closedPath: false,
            points: [
                { x: 2, y: -3 },
                { x: 2, y: 3 },
                { x: 2, y: 0 },
                { x: -2, y: 0 },
                { x: -2, y: -3 },
                { x: -2, y: 3 }
            ],
        },
        I: {
            closedPath: false,
            points: [
                { x: -2, y: 3 },
                { x: 2, y: 3 },
                { x: 0, y: 3 },
                { x: 0, y: -3 },
                { x: 2, y: -3 },
                { x: -2, y: -3 },
            ],
        },
        J: {
            closedPath: false,
            points: [
                { x: 2, y: -3 },
                { x: 2, y: 3 },
                { x: 0, y: 3 },
                { x: -2, y: 1 },
            ],
        },
        K: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: -2, y: 0 },
                { x: 2, y: 3 },
                { x: -2, y: 0 },
                { x: 2, y: -3 },
            ],
        },
        L: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: 2, y: 3 },
            ],
        },
        M: {
            closedPath: false,
            points: [
                { x: -2, y: 3 },
                { x: -2, y: -3 },
                { x: 0, y: 0 },
                { x: 2, y: -3 },
                { x: 2, y: 3 },
            ],
        },
        N: {
            closedPath: false,
            points: [
                { x: -2, y: 3 },
                { x: -2, y: -3 },
                { x: 2, y: 3 },
                { x: 2, y: -3 },
            ],
        },
        O: {
            closedPath: true,
            points: [
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: 2, y: 3 },
                { x: 2, y: -3 },
            ],
        },
        P: {
            closedPath: false,
            points: [
                { x: -2, y: 3 },
                { x: -2, y: -3 },
                { x: 2, y: -3 },
                { x: 2, y: 0 },
                { x: -2, y: 0 },
            ],
        },
        Q: {
            closedPath: true,
            points: [
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: 0, y: 3 },
                { x: 1, y: 2 },
                { x: 0, y: 1 },
                { x: 2, y: 3 },
                { x: 1, y: 2 },
                { x: 2, y: 1 },
                { x: 2, y: 0 },
                { x: 2, y: -3 }
            ],
        },
        R: {
            closedPath: false,
            points: [
                { x: -2, y: 3 },
                { x: -2, y: -3 },
                { x: 2, y: -3 },
                { x: 2, y: 0 },
                { x: -2, y: 0 },
                { x: 2, y: 3 },
            ],
        },
        S: {
            closedPath: false,
            points: [
                { x: 2, y: -3 },
                { x: -2, y: -3 },
                { x: -2, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 3 },
                { x: -2, y: 3 },
            ],
        },
        T: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: 2, y: -3 },
                { x: 0, y: -3 },
                { x: 0, y: 3 },
            ],
        },
        U: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: 2, y: 3 },
                { x: 2, y: -3 },
            ],
        },
        V: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: 0, y: 3 },
                { x: 2, y: -3 },
            ],
        },
        W: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: -2, y: 3 },
                { x: 0, y: 0 },
                { x: 2, y: 3 },
                { x: 2, y: -3 },
            ],
        },
        X: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: 2, y: 3 },
                { x: 0, y: 0 },
                { x: -2, y: 3 },
                { x: 2, y: -3 },
            ],
        },
        Y: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: 0, y: 0 },
                { x: 2, y: -3 },
                { x: 0, y: 0 },
                { x: 0, y: 3 },
            ],
        },
        Z: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: 2, y: -3 },
                { x: -2, y: 3 },
                { x: 2, y: 3 },
            ],
        },
        0: {
            closedPath: false,
            points: [
                { x: 2, y: -3 },
                { x: -2, y: 3 },
                { x: -2, y: -3 },
                { x: 2, y: -3 },
                { x: 2, y: 3 },
                { x: -2, y: 3 },
            ],
        },
        1: {
            closedPath: false,
            points: [
                { x: 0, y: 3 },
                { x: 0, y: -3 }
            ],
        },
        2: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: 2, y: -3 },
                { x: 2, y: 0 },
                { x: -2, y: 0 },
                { x: -2, y: 3 },
                { x: 2, y: 3 },
            ],
        },
        3: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: 2, y: -3 },
                { x: 2, y: 0 },
                { x: -1, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 3 },
                { x: -2, y: 3 },
            ]
        },
        4: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: -2, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: -3 },
                { x: 2, y: 3 },
            ]
        },
        5: {
            closedPath: false,
            points: [
                { x: 2, y: -3 },
                { x: -2, y: -3 },
                { x: -2, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 3 },
                { x: -2, y: 3 },
            ]
        },
        6: {
            closedPath: false,
            points: [
                { x: 2, y: -3 },
                { x: -2, y: -3 },
                { x: -2, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 3 },
                { x: -2, y: 3 },
                { x: -2, y: 0 }
            ]
        },
        7: {
            closedPath: false,
            points: [
                { x: -2, y: -3 },
                { x: 2, y: -3 },
                { x: 2, y: 3 },
            ]
        },
        8: {
            closedPath: true,
            points: [
                { x: -2, y: -3 },
                { x: 2, y: -3 },
                { x: 2, y: 3 },
                { x: -2, y: 3 },
                { x: -2, y: 0 },
                { x: 2, y: 0 },
                { x: -2, y: 0 },
            ]
        },
        9: {
            closedPath: false,
            points: [
                { x: -2, y: 3 },
                { x: 2, y: 3 },
                { x: 2, y: -3 },
                { x: -2, y: -3 },
                { x: -2, y: 0 },
                { x: 2, y: 0 },
            ]
        },
        _: {
            closedPath: false,
            points: [
                { x: -2, y: 3 },
                { x: 2, y: 3 },
            ]
        },
    }
};