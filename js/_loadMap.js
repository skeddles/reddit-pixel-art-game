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

	if (DEBUG) {
		let mapDataSprite = PIXI.Sprite.from(mapDataImage);
		mapDataSprite.scale.set(TILESIZE, TILESIZE);
		mapDataSprite.blendMode = PIXI.BLEND_MODES.SCREEN;
		GAME.level.addChild(mapDataSprite);
	}

	//load player
	let playerSprite = PIXI.Sprite.from('images/char.png');
		playerSprite.x = TILESIZE * mapData.startingLocation.x;
		playerSprite.y = TILESIZE * mapData.startingLocation.y;
		GAME.player = playerSprite;
		GAME.level.addChild(playerSprite);

	//load main collectable
	let mainCollectableSprite = PIXI.Sprite.from('images/star.png');
		mainCollectableSprite.x = TILESIZE * GAME.currentMap.mainCollectable.x;
		mainCollectableSprite.y = TILESIZE * GAME.currentMap.mainCollectable.y;
		GAME.level.addChild(mainCollectableSprite);
		GAME.currentMap.mainCollectable = mainCollectableSprite;

	//load minor collectables
	GAME.currentMap.minorCollectables = GAME.currentMap.minorCollectables.map(collectable => {
		let sprite = PIXI.Sprite.from('images/coin.png');
		sprite.x = TILESIZE * collectable.x;
		sprite.y = TILESIZE * collectable.y;
		GAME.level.addChild(sprite);
		return sprite;
	})

	//format kill tiles
	GAME.currentMap.killTiles = GAME.currentMap.killTiles.map(kt => ({
			x: kt.x * TILESIZE,
			y: kt.y * TILESIZE,
		}));


	if (DEBUG) {
		GAME.currentMap.targetSquare = new PIXI.Graphics();
		GAME.currentMap.targetSquare.lineStyle(1, 0x0000ff);
		GAME.currentMap.targetSquare.drawRect(0, 0, 16, 16); // x, y, width, height
		GAME.level.addChild(GAME.currentMap.targetSquare);

		GAME.currentMap.playerSquare = new PIXI.Graphics();
		GAME.currentMap.playerSquare.lineStyle(1, 0xff0000);
		GAME.currentMap.playerSquare.drawRect(0, 0, 16, 16); // x, y, width, height
		GAME.level.addChild(GAME.currentMap.playerSquare);	
	}

		
//USER Interface
	initializeUI();

	

	//play start sound
	zzfx(...[,,130,.07,.01,.12,1,.66,27,14,,,,,5]);
}