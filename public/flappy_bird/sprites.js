let sprites = {
    bird: [
        [
            { x: 6, y: 982, width: 34, height: 24 },
            { x: 62, y: 982, width: 34, height: 24 },
            { x: 118, y: 982, width: 34, height: 24 },
        ], [
            { x: 174, y: 982, width: 34, height: 24 },
            { x: 230, y: 658, width: 34, height: 24 },
            { x: 230, y: 710, width: 34, height: 24 },
        ], [
            { x: 230, y: 762, width: 34, height: 24 },
            { x: 230, y: 814, width: 34, height: 24 },
            { x: 230, y: 866, width: 34, height: 24 },
        ]
    ],
    backGround: {
        day: { x: 0, y: 0, width: 288, height: 512 },
        night: { x: 292, y: 0, width: 288, height: 512 },
    },
    foreGround: { x: 584, y: 0, width: 336, height: 112 },
    pipe: {
        green: {
            top: { x: 112, y: 646, width: 52, height: 320 },
            bottom: { x: 168, y: 646, width: 52, height: 320 }
        },
        red: {
            top: { x: 0, y: 646, width: 52, height: 320 },
            bottom: { x: 56, y: 646, width: 52, height: 320 }
        },
    },
    gameOver: { x: 782, y: 112, width: 210, height: 60 },
    getReady: { x: 580, y: 112, width: 204, height: 60 },
    sign: { x: 0, y: 512, width: 242, height: 132 },
    play: { x: 700, y: 232, width: 120, height: 70 },
    highScore: { x: 820, y: 232, width: 120, height: 70 },
    medal: {
        platinum: { x: 242, y: 516, width: 44, height: 44 },
        gold: { x: 242, y: 564, width: 44, height: 44 },
        silver: { x: 224, y: 906, width: 44, height: 44 },
        bronze: { x: 224, y: 954, width: 44, height: 44 },
    },
    tapToPlay: { x: 584, y: 176, width: 114, height: 106 },
    numbersBig: [
        { x: 992, y: 120, width: 24, height: 36 }, // 0
        { x: 272, y: 910, width: 16, height: 36 }, // 1
        { x: 584, y: 320, width: 24, height: 36 }, // 2
        { x: 612, y: 320, width: 24, height: 36 }, // 3
        { x: 640, y: 320, width: 24, height: 36 }, // 4
        { x: 668, y: 320, width: 24, height: 36 }, // 5
        { x: 584, y: 368, width: 24, height: 36 }, // 6
        { x: 612, y: 368, width: 24, height: 36 }, // 7
        { x: 640, y: 368, width: 24, height: 36 }, // 8
        { x: 668, y: 368, width: 24, height: 36 }, // 9
    ],
    numbersSmall: [
        { x: 276, y: 646, width: 12, height: 14 }, // 0
        { x: 276, y: 664, width: 12, height: 14 }, // 1
        { x: 276, y: 698, width: 12, height: 14 }, // 2
        { x: 276, y: 716, width: 12, height: 14 }, // 3
        { x: 276, y: 750, width: 12, height: 14 }, // 4
        { x: 276, y: 768, width: 12, height: 14 }, // 5
        { x: 276, y: 802, width: 12, height: 14 }, // 6
        { x: 276, y: 820, width: 12, height: 14 }, // 7
        { x: 276, y: 854, width: 12, height: 14 }, // 8
        { x: 276, y: 872, width: 12, height: 14 }, // 9
    ],
    numbersMedium: [
        { x: 1024 * 0.265625, y: 1024 * 0.59765625, width: 16, height: 20 },
        { x: 1024 * 0.265625, y: 1024 * 0.9316406, width: 16, height: 20 },
        { x: 1024 * 0.265625, y: 1024 * 0.9550781, width: 16, height: 20 },
        { x: 1024 * 0.25390625, y: 1024 * 0.9785156, width: 16, height: 20 },
        { x: 1024 * 0.9785156, y: 1024 * 0.0, width: 16, height: 20 },
        { x: 1024 * 0.9785156, y: 1024 * 0.0234375, width: 16, height: 20 },
        { x: 1024 * 0.98437, y: 1024 * 0.05078125, width: 16, height: 20 },
        { x: 1024 * 0.98437, y: 1024 * 0.08203125, width: 16, height: 20 },
        { x: 1024 * 0.5703125, y: 1024 * 0.47265625, width: 16, height: 20 },
        { x: 1024 * 0.60546875, y: 1024 * 0.40234375, width: 16, height: 20 },
    ],
    newHiscore: { x: 224, y: 1002, width: 32, height: 14 },
    spark: [
        { x: 276, y: 786, width: 10, height: 10 },
        { x: 276, y: 734, width: 10, height: 10 },
        { x: 276, y: 682, width: 10, height: 10 },
    ],
};

