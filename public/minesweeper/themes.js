var themes = [ {
		name: "classic",
		empty: "./img/square.svg",
		mine: "./img/my_mine.png",
		flag: "./img/flag.svg"
	},
	{
		name: "modern",
		empty: "./img/tile.png",
		mine: "./img/mine2.png",
		mineExpload: "./img/mine.png",
		flag: "./img/tile3.png"
	},
	{
		name: "modern2",
		empty: "./img/modern2/grid-unknown.png",
		mine: "./img/modern2/grid-bomb.png",
		flag: "./img/modern2/grid-flag.png",
		grid: "./img/modern2/grid-0.png",
		numbers: ["./img/modern2/grid-0.png", "./img/modern2/grid-1.png", "./img/modern2/grid-2.png", "./img/modern2/grid-3.png", "./img/modern2/grid-4.png",
				  "./img/modern2/grid-5.png", "./img/modern2/grid-6.png", "./img/modern2/grid-7.png", "./img/modern2/grid-8.png"]
	},
	{
		name: "custom",
		url: "./img/custom.png",
		size: 64,
		cover: {x: 0, y: 0},
		background: { x: 64, y: 0},
		1: { x: 128, y: 0 },
		2: { x: 192, y: 0 },
		3: { x: 256, y: 0 },
		4: { x: 320, y: 0 },
		5: { x: 384, y: 0 },
		6: { x: 448, y: 0 },
		7: { x: 512, y: 0 },
		8: { x: 576, y: 0 },
		flag: { x: 640, y: 0 },
		mine: { x: 0, y: 64 },
		mineExpload: { x: 64, y: 64 }
	}];