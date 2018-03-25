const drivers = ["Janne", "Jean", "Jörgen", "Sanna", "Stefan", "Robin"];

const schema = [
    // Vecka 6
    [{
        "172": drivers[5],
        "177": drivers[4],
        "175": drivers[0],
        "176": drivers[1]
    },
    {
        "172": drivers[5],
        "177": drivers[3],
        "175": drivers[0],
        "176": drivers[1]
    },
    {
        "172": drivers[3],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[1]
    },
    {
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[3],
        "176": drivers[4]
    },
    {
        "172": drivers[4],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[1]
    }
    ],
    // Vecka 7
    [{
        "172": drivers[4],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[1]
    },
    {
        "172": drivers[3],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[1]
    },
    {
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[4],
        "176": drivers[3]
    },
    {
        "172": drivers[5],
        "177": drivers[3],
        "175": drivers[0],
        "176": drivers[4]
    },
    {
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[1]
    }
    ],
    // Vecka 8
    [{
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[1]
    },
    {
        "172": drivers[3],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[1]
    },
    {
        "172": drivers[5],
        "177": drivers[4],
        "175": drivers[3],
        "176": drivers[1]
    },
    {
        "172": drivers[5],
        "177": drivers[4],
        "175": drivers[3],
        "176": drivers[1]
    },
    {
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[4]
    }
    ],
    // Vecka 9
    [{
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[4]
    },
    {
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[3]
    },
    {
        "172": drivers[4],
        "177": drivers[2],
        "175": drivers[3],
        "176": drivers[1]
    },
    {
        "172": drivers[4],
        "177": drivers[3],
        "175": drivers[0],
        "176": drivers[1]
    },
    {
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[4],
        "176": drivers[1]
    }
    ],
    // Vecka 10
    [{
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[4],
        "176": drivers[1]
    },
    {
        "172": drivers[5],
        "177": drivers[2],
        "175": drivers[4],
        "176": drivers[3]
    },
    {
        "172": drivers[5],
        "177": drivers[3],
        "175": drivers[0],
        "176": drivers[1]
    },
    {
        "172": drivers[4],
        "177": drivers[2],
        "175": drivers[0],
        "176": drivers[3]
    },
    {
        "172": drivers[5],
        "177": drivers[4],
        "175": drivers[0],
        "176": drivers[1]
    }
    ]
];

const test = {
    "Schema": {
        "Vecka 6": {
            "Måndag": {
                "172": "Robin",
                "177": "Stefan",
                "175": drivers[0],
                "176": drivers[1]
            },
            "Tisdag": {
                "172": "Robin",
                "177": "Sanna",
                "175": drivers[0],
                "176": drivers[1]
            },
            "Onsdag": {
                "172": "Sanna",
                "177": "Jörgen",
                "175": drivers[0],
                "176": drivers[1]
            },
            "Torsdag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": "Sanna",
                "176": "Stefan"
            },
            "Fredag": {
                "172": "Stefan",
                "177": "Jörgen",
                "175": drivers[0],
                "176": drivers[1]
            }
        },
        "Vecka 7": {
            "Måndag": {
                "172": "Stefan",
                "177": "Jörgen",
                "175": drivers[0],
                "176": drivers[1]
            },
            "Tisdag": {
                "172": "Sanna",
                "177": "Jörgen",
                "175": drivers[0],
                "176": drivers[1]
            },
            "Onsdag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": "Stefan",
                "176": "Sanna"
            },
            "Torsdag": {
                "172": "Robin",
                "177": "Sanna",
                "175": drivers[0],
                "176": "Stefan"
            },
            "Fredag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": drivers[0],
                "176": drivers[1]
            }
        },
        "Vecka 8": {
            "Måndag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": drivers[0],
                "176": drivers[1]
            },
            "Tisdag:": {
                "172": "Sanna",
                "177": "Jörgen",
                "175": drivers[0],
                "176": drivers[1]
            },
            "Onsdag": {
                "172": "Robin",
                "177": "Stefan",
                "175": "Sanna",
                "176": drivers[1]
            },
            "Torsdag": {
                "172": "Robin",
                "177": "Stefan",
                "175": "Sanna",
                "176": drivers[1]
            },
            "Fredag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": drivers[0],
                "176": "Stefan"
            }
        },
        "Vecka 9": {
            "Måndag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": drivers[0],
                "176": "Stefan"
            },
            "Tisdag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": drivers[0],
                "176": "Sanna"
            },
            "Onsdag": {
                "172": "Stefan",
                "177": "Jörgen",
                "175": "Sanna",
                "176": drivers[1]
            },
            "Torsdag": {
                "172": "Stefan",
                "177": "Sanna",
                "175": drivers[0],
                "176": drivers[1]
            },
            "Fredag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": "Stefan",
                "176": drivers[1]
            }
        },
        "Vecka 10": {
            "Måndag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": "Stefan",
                "176": drivers[1]
            },
            "Tisdag": {
                "172": "Robin",
                "177": "Jörgen",
                "175": "Stefan",
                "176": "Sanna"
            },
            "Onsdag": {
                "172": "Robin",
                "177": "Sanna",
                "175": drivers[0],
                "176": drivers[1]
            },
            "Torsdag": {
                "172": "Stefan",
                "177": "Jörgen",
                "175": drivers[0],
                "176": "Sanna"
            },
            "Fredag": {
                "172": "Robin",
                "177": "Stefan",
                "175": drivers[0],
                "176": drivers[1]
            }
        }
    }
};

export {
    drivers,
    schema,
    test
};