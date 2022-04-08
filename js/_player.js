
//the spritesheet json data which will get parsed by new PIXI.SpriteSheet().parse()
GAME.playerSpriteData = {
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
	"animations": {},
};

//programatically create frames and animations
['down', 'downside', 'side', 'upside', 'up'].forEach((direction,y) => {
	let anim = [];
	['stand','right','stand','left'].forEach((frame,x) => {

		//frame 3 should be the same as frame 1
		if (x == 2) x = 0;
		if (x == 3) x = 2;

		//frame
		let frameName = direction+'-'+frame;
		anim.push(frameName);
		GAME.playerSpriteData.frames[frameName] = {
			"frame": {"x":x*TILESIZE, "y":y*TILESIZE*2, "w":TILESIZE, "h":TILESIZE*2},
			"sourceSize": {"w":TILESIZE, "h":TILESIZE*2},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {
				"x": 0,
				"y": 0,
				"w": TILESIZE,
				"h": TILESIZE*2
			},
		};
	});

	//animation
	GAME.playerSpriteData.animations[direction] = anim;
});


