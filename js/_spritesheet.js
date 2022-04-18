
//a 2d array which maps directly to the position of each tile on the spritesheet layout
GAME.tileNames = [
	['mainCollectable', 'minorCollectables0', 'minorCollectables1', 'minorCollectables2', 'window1', 'window2', 'window3', 'window4'],
	['teleport1a', 'teleport1b','teleport2a', 'teleport2b','teleport3a', 'teleport3b','teleport4a', 'teleport4b'],
	['key1', 'door1', 'key2', 'door2','key3', 'door3', 'key4', 'door4'],
	['', '', '', '','', '', '', ''],
	['', '', '', '','', '', '', ''],
	['', '', '', '','', '', '', ''],
	['', '', '', '','', '', '', ''],
	['', '', '', '','', '', '', '']
];

//the spritesheet json data which will get parsed by new PIXI.SpriteSheet().parse()
GAME.spriteSheetData = {
	"frames": {},
	"meta": {
		"app": "https://github.com/skeddles/reddit-pixel-art-game",
		"version": "1.0",
		"image": "spritesheet.png",
		"format": "RGBA8888",
		"size": {
			"w": 128,
			"h": 128
		},
		"scale": "1"
	},
	"animations": {
		"teleport1": ['teleport1a','teleport1b'],
		"teleport2": ['teleport2a','teleport2b'],
		"teleport3": ['teleport3a','teleport3b'],
		"teleport4": ['teleport4a','teleport4b'],
	},
}

//process the frames and add all the data they need
GAME.tileNames.forEach( (tileRow,y) => {
	tileRow.forEach( (tileName,x) => {
		if (tileName=='') return;
		GAME.spriteSheetData.frames[tileName] = {
			"frame": {"x":  x*TILESIZE,"y": y*TILESIZE,"w": TILESIZE,"h": TILESIZE},
			"sourceSize": {"w": TILESIZE,"h": TILESIZE},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": TILESIZE,
				"h": TILESIZE
			},
		}
	});
});

delete GAME.tileNames;