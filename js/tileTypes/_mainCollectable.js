new TileType('mainCollectable', [255,255,0], {
	required: true,
	maxNumberAllowed: 1,
	onLoad: (object)=> {

		//if we should check if theres a loaded game
		if (GAME.saveData && GAME.currentMap.levelName !== 'loadedLevel') {
			//see if in the save data there is a record of finding a collectable at this same coordinate
			if (GAME.saveData.unlockedLevels[GAME.currentMap.levelName].complete) 
				return console.log('skipping loading collectable',object);
		}

		//create sprite like normal
		let sprite = new PIXI.Sprite(GAME.currentMap.spritesheet.textures['mainCollectable']);
			sprite.x = TILESIZE * object.x;
			sprite.y = TILESIZE * object.y;
			GAME.level.addChild(sprite);
		return sprite;
	},
	uiInit: ()=>{
		//main collectable text
		GAME.ui.mainCollectableFound = new PIXI.Text('',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'right'});
		GAME.ui.mainCollectableFound.x = (GAME.app.renderer.width / GAME.app.stage.scale.x) / 2 ;
		GAME.ui.mainCollectableFound.y = (GAME.app.renderer.height / GAME.app.stage.scale.y);
		GAME.ui.mainCollectableFound.anchor.set(0.5,1);
		GAME.ui.addChild(GAME.ui.mainCollectableFound);
	},
	uiUpdate: ()=> {
		GAME.ui.mainCollectableFound.text = GAME.currentMap.mainCollectable.length>0 ? '' : 'LEVEL COMPLETE';
	}
});

new CollisionType('mainCollectable', 'rect',  function () {

	//extract the main collectable sprite
	var image = new Image();
	image.onload = function() {
		let canv = document.createElement('CANVAS'); 
		canv.width = TILESIZE;
		canv.height = TILESIZE;
		let ctx = canv.getContext('2d');
		ctx.drawImage(image, 0, 0);

		let iconData = canv.toDataURL()

		//save the game
		updateSaveData(()=>{
			GAME.saveData.unlockedLevels[GAME.currentMap.levelName].complete = true;
			GAME.saveData.unlockedLevels[GAME.currentMap.levelName].mainCollectableIcon = iconData;
		});
	};
	image.src = GAME.currentMap.spriteSheetTexture;

	//remove the collectable, play sound
	GAME.level.removeChild(GAME.currentMap.mainCollectable[0]);
	zzfx(...[,,730,,.06,.18,1,.23,,9.8,-158,.04,,,,,,.63,.05]);
	GAME.currentMap.mainCollectable.length = 0;
});
