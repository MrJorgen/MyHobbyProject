function setBlocks() {
    //O ok
    var o0 = [[1, 1], [2, 1], [1, 2], [2, 2]];
    var oRotations = [o0];
    //I ok
    var i0 = [[0, 1], [1, 1], [2, 1], [3, 1]];
    var i90 = [[2, 1], [2, 0], [2, 3], [2, 2]];
    var iRotations = [i0, i90];
    //S ok
    var s0 = [[1, 2], [2, 1], [2, 2], [3, 1]];
    var s90 = [[2, 1], [2, 0], [3, 2], [3, 1]];
    var sRotations = [s0, s90];
    //Z ok
    var z0 = [[1, 1], [2, 1], [2, 2], [3, 2]];
    var z90 = [[2, 1], [3, 0], [2, 2], [3, 1]];
    var zRotations = [z0, z90];
    //L ok
    var l0 = [[1, 1], [2, 1], [1, 2], [3, 1]];
    var l90 = [[2, 0], [2, 1], [2, 2], [3, 2]];
    var l180 = [[1, 1], [3, 0], [2, 1], [3, 1]];
    var l270 = [[1, 0], [2, 0], [2, 2], [2, 1]];
    var lRotations = [l0, l90, l180, l270];
    //J ok
    var j0 = [[1, 1], [2, 1], [3, 2], [3, 1]]; 
    var j90 = [[2, 1], [2, 0], [2, 2], [3, 0]];
    var j180 = [[1, 1], [1, 0], [2, 1], [3, 1]];
    var j270 = [[1, 2], [2, 0], [2, 2], [2, 1]];
    var jRotations = [j0, j90, j180, j270];
    //T ok
    var t0 = [[1, 1], [2, 1], [2, 2], [3, 1]];
    var t90 = [[2, 1], [2, 0], [2, 2], [3, 1]];
    var t180 = [[1, 1], [2, 0], [2, 1], [3, 1]];
    var t270 = [[1, 1], [2, 0], [2, 2], [2, 1]];
    var tRotations = [t0, t90, t180, t270];

    //O
    block = new Array();
    block[0] = {
        "blockPos": { "x": 0, "y": 0 },
        "color": "#FF0",
        "rotations": oRotations,
        "currRotation": 0,
        "name": "O"
    };
    //I
    block[1] = {
        "blockPos": { "x": 0, "y": 0 },
        "color": "#0FF",
        "rotations": iRotations,
        "currRotation": 0,
        "name": "I"
    };
    //J
    block[2] = {
        "blockPos": { "x": 0, "y": 0 },
        "color": "#00F",
        "rotations": jRotations,
        "currRotation": 0,
        "name": "J"
    };
    //L
    block[3] = {
        "blockPos": { "x": 0, "y": 0 },
        "color": "#FF7700",
        "rotations": lRotations,
        "currRotation": 0,
        "name": "L"
    };
    //T
    block[4] = {
        "blockPos": { "x": 0, "y": 0 },
        "color": "#F0F",
        "rotations": tRotations,
        "currRotation": 0,
        "name": "T"
    };
    //S
    block[5] = {
        "blockPos": { "x": 0, "y": 0 },
        "color": "#0F0",
        "rotations": sRotations,
        "currRotation": 0,
        "name": "S"
    };
    //Z
    block[6] = {
        "blockPos": { "x": 0, "y": 0 },
        "color": "#F00",
        "rotations": zRotations,
        "currRotation": 0,
        "name": "Z"
    };
}