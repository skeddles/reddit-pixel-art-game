var debug = {
	onLoad: ()=>{
		if (!DEBUG) return;

	//show players collission box
		let bounding = new PIXI.Graphics();
		bounding.lineStyle(1, 0xff0000);
		bounding.drawCircle(8, 8, 7);
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

	//show collision boxes
		//let collisionBoxes;	
		GAME.CollisionTypes.forEach(ct => {
			ct.objects.forEach(o => {

				let collisionBox = new PIXI.Graphics();
				let isContainer = (o.constructor.prototype instanceof PIXI.Container);
				
				//x/y coordinates to place on map (only used if not a container, since then its just a child of the sprite)
				let x = isContainer?0:o.x;
				let y = isContainer?0:o.y;

				//rectangle collisions
				if (ct.type == 'rect') {
					collisionBox.lineStyle(1, 0x0000ff);
					collisionBox.drawRect(x, y, 16, 16); // x, y, width, height
				}

				//circle collisions
				if (ct.type == 'circle') {
					collisionBox.lineStyle(1, 0x0000ff);
					collisionBox.drawCircle(x+8, y+8, 8); // x, y, radius
				}
				
				//add as child to object (or just add to stage if no object)
				if (isContainer)
					o.addChild(collisionBox);
				else {
					GAME.level.addChild(collisionBox);
					console.log('added generic colission for', ct.objectHolderName,x,y,isContainer?'isContainer':'notContainer')
				}
			});
		});


		// Loop through all of the objectsToCheck and see if any have a collision
		//let collision = collisionBoxes.find(this.checkForCollision.bind(this));
			
	//overlays map data image onto map (BROKEN)
		//let mapDataSprite = PIXI.Sprite.from(mapDataImage);
		//mapDataSprite.scale.set(TILESIZE, TILESIZE);
		//mapDataSprite.blendMode = PIXI.BLEND_MODES.SCREEN;
		//GAME.level.addChild(mapDataSprite);
	},
	onLoop: ()=>{
		if (!DEBUG) return;

		//shows which space the player is in / targetting (for smooshing) (BROKEN)
		//GAME.currentMap.playerSquare.x = playerGridX * TILESIZE;
		//GAME.currentMap.playerSquare.y = playerGridY * TILESIZE;
		//GAME.currentMap.targetSquare.x = (playerGridX+hspeed) * TILESIZE;
		//GAME.currentMap.targetSquare.y = (playerGridY+vspeed) * TILESIZE;		
	}
}