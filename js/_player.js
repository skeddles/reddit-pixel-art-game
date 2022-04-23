
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


function loadPlayer (mapData) {
	//PLAYER
	//create player sprite container
	GAME.player = new PIXI.Container();
		GAME.player.x = TILESIZE * mapData.entrance[0].x;
		GAME.player.y = TILESIZE * mapData.entrance[0].y;
		GAME.player.zIndex = 1; //keeps player on top of everything else
		GAME.player.immobile = 0;
		GAME.level.addChild(GAME.player);

	//add actual player sprite as child of container so it can be easily flipped and moved around
	//GAME.player.sprite = PIXI.Sprite.from('images/char.png');
	let playerSpriteTexture = new PIXI.BaseTexture(mapData.playerSpriteSheet || 'images/player.png');
	GAME.player.spritesheet = new PIXI.Spritesheet(playerSpriteTexture, GAME.playerSpriteData);
		GAME.player.spritesheet.parse(e => console.log('player spritesheet been loaded'));
		//create sprites for each character animation
		GAME.playerSprites = {};
		Object.keys(GAME.playerSpriteData.animations).forEach(animation => {
			GAME.playerSprites[animation] = new PIXI.AnimatedSprite(GAME.player.spritesheet.animations[animation]);
		});
		
	GAME.player.sprite = new PIXI.AnimatedSprite(GAME.player.spritesheet.animations['down']);
		GAME.player.currentAnimation = 'down';	
		GAME.player.sprite.position.set(TILESIZE/2,-TILESIZE);
		GAME.player.sprite.anchor.set(0.5,0);
		GAME.player.sprite.animationSpeed = 1/8; 
		GAME.player.sprite.play();
		GAME.player.addChild(GAME.player.sprite);
}