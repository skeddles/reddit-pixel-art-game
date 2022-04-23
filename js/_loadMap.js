var pp= 0;

function loadMap (mapName, mapData) {
	console.log('loading map', mapData);

	//clearing game of all objects
	while(GAME.app.stage.children[0])
		GAME.app.stage.removeChild(GAME.app.stage.children[0]);

	//iniitalize current map data
	GAME.currentMap = mapData;
	GAME.currentMap.levelName = mapName;
	GAME.level = new PIXI.Container();
		GAME.level.sortableChildren = true; //enables z-ordering
	GAME.app.stage.addChild(GAME.level);

//LEVEL

	//load background image
	GAME.currentMap.bg = PIXI.Sprite.from(mapData.backgroundImage);
	GAME.level.addChild(GAME.currentMap.bg);

//SPRITESHEET

	let spriteSheetTexture = new PIXI.BaseTexture(mapData.objectSpriteSheet || 'images/spritesheet.png');
	GAME.currentMap.spritesheet = new PIXI.Spritesheet(spriteSheetTexture, GAME.spriteSheetData);
	GAME.currentMap.spritesheet.parse(e => console.log('spritesheet textures have been loaded'));
	
	loadPlayer(mapData);

// Window Layer
	GAME.level.windowLayer = new PIXI.Container();
		GAME.level.windowLayer.zIndex = 2; //keeps on top of player
		GAME.level.addChild(GAME.level.windowLayer);

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