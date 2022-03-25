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

//PLAYER
	//create player sprite container
	GAME.player = new PIXI.Container();
		GAME.player.x = TILESIZE * mapData.startingLocation.x;
		GAME.player.y = TILESIZE * mapData.startingLocation.y;
		GAME.player = GAME.player;
		GAME.level.addChild(GAME.player);

		let bounding = new PIXI.Graphics();
		bounding.lineStyle(1, 0xff0000);
		bounding.drawRect(0, 0, 16, 16); // x, y, width, height
		GAME.player.addChild(bounding);	
	//add actual player sprite as child of container so it can be easily flipped and moved around
	GAME.player.sprite = PIXI.Sprite.from('images/char.png');
		GAME.player.sprite.position.set(TILESIZE/2,-TILESIZE);
		GAME.player.sprite.anchor.set(0.5,0);
		GAME.player.addChild(GAME.player.sprite);


//TILES
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
	});

	//load keys
	GAME.currentMap.keys = GAME.currentMap.keys.map(key => {
		let sprite = PIXI.Sprite.from('images/key.png');
		sprite.x = TILESIZE * key.x;
		sprite.y = TILESIZE * key.y;
		GAME.level.addChild(sprite);
		return sprite;
	});

	//load doors
	GAME.currentMap.doors = GAME.currentMap.doors.map(door => {
		let sprite = PIXI.Sprite.from('images/door.png');
		sprite.x = TILESIZE * door.x;
		sprite.y = TILESIZE * door.y;
		GAME.level.addChild(sprite);
		return sprite;
	});

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