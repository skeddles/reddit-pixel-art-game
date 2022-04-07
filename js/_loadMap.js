var pp= 0;

function loadMap (mapData) {
	console.log('loading map', mapData);

	//clearing game of all objects
	//while(GAME.level.children[0])
	//	GAME.app.stage.removeChild(GAME.app.stage.children[0]);

	//iniitalize current map data
	GAME.currentMap = mapData;
	GAME.level = new PIXI.Container();
	GAME.app.stage.addChild(GAME.level);

//LEVEL

	//load background image
	GAME.currentMap.bg = PIXI.Sprite.from(mapData.backgroundImage);
	GAME.level.addChild(GAME.currentMap.bg);

//SPRITESHEET

	let spriteSheetTexture = new PIXI.BaseTexture('images/spritesheet.png');
	GAME.currentMap.spritesheet = new PIXI.Spritesheet(spriteSheetTexture, GAME.spriteSheetData);
	GAME.currentMap.spritesheet.parse(e => console.log('spritesheet textures have been loaded'));
	
//PLAYER
	//create player sprite container
	GAME.player = new PIXI.Container();
		GAME.player.x = TILESIZE * mapData.entrance[0].x;
		GAME.player.y = TILESIZE * mapData.entrance[0].y;
		GAME.player.immobile = 0;
		GAME.level.addChild(GAME.player);

	//add actual player sprite as child of container so it can be easily flipped and moved around
	GAME.player.sprite = PIXI.Sprite.from('images/char.png');
		GAME.player.sprite.position.set(TILESIZE/2,-TILESIZE);
		GAME.player.sprite.anchor.set(0.5,0);
		GAME.player.addChild(GAME.player.sprite);

//USER Interface
	GAME.ui = new PIXI.Container();
	GAME.app.stage.addChild(GAME.ui);

//TILES
	//load all types of tiles
	GAME.tileTypes.forEach(type => type.load());

	debug.onLoad();

	GAME.ready = true;
	//play start sound
	zzfx(...[,,130,.07,.01,.12,1,.66,27,14,,,,,5]);


}