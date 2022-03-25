var debug = {
	onLoad: ()=>{
		if (!DEBUG) return;

	//show players collission box
		let bounding = new PIXI.Graphics();
		bounding.lineStyle(1, 0xff0000);
		bounding.drawRect(0, 0, 16, 16); // x, y, width, height
		GAME.player.addChild(bounding);	

	//target squares to show where player is pointing (used for movement)
		GAME.currentMap.targetSquare = new PIXI.Graphics();
		GAME.currentMap.targetSquare.lineStyle(1, 0x0000ff);
		GAME.currentMap.targetSquare.drawRect(0, 0, 16, 16); // x, y, width, height
		GAME.level.addChild(GAME.currentMap.targetSquare);

		GAME.currentMap.playerSquare = new PIXI.Graphics();
		GAME.currentMap.playerSquare.lineStyle(1, 0xff0000);
		GAME.currentMap.playerSquare.drawRect(0, 0, 16, 16); // x, y, width, height
		GAME.level.addChild(GAME.currentMap.playerSquare);	

			
	//overlays map data image onto map 
		let mapDataSprite = PIXI.Sprite.from(mapDataImage);
		mapDataSprite.scale.set(TILESIZE, TILESIZE);
		mapDataSprite.blendMode = PIXI.BLEND_MODES.SCREEN;
		GAME.level.addChild(mapDataSprite);
	},
	onLoop: ()=>{
		if (!DEBUG) return;

		GAME.currentMap.playerSquare.x = playerGridX * TILESIZE;
		GAME.currentMap.playerSquare.y = playerGridY * TILESIZE;
		GAME.currentMap.targetSquare.x = (playerGridX+hspeed) * TILESIZE;
		GAME.currentMap.targetSquare.y = (playerGridY+vspeed) * TILESIZE;		
	}
}