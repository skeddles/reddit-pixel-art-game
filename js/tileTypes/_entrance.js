new TileType('entrance', [255,0,255], {
	required: true,
	maxNumberAllowed: 1,
	onLoad: object => {

		let spriteHolder = new PIXI.Container();
			spriteHolder.x = TILESIZE * object.x;
			spriteHolder.y = TILESIZE * object.y;
			GAME.level.addChild(spriteHolder);

		let brightener = new PIXI.AnimatedSprite(GAME.portalSpriteSheet.animations.animation);
			brightener.x = -5;
			brightener.y = -5;
			brightener.animationSpeed = 0.167; 
			brightener.play();
			//brightener.alpha = 0.5
			spriteHolder.addChild(brightener);

		let sprite = new PIXI.AnimatedSprite(GAME.portalSpriteSheet.animations.animation);
			sprite.x = -5;
			sprite.y = -5;
			sprite.animationSpeed = 0.167; 
			sprite.play();
			sprite.tint = 0xa139c7;
			spriteHolder.addChild(sprite);

		GAME.playerInEntranceFlag = true;

		return spriteHolder;
	},
});


new CollisionType('entrance', 'circle', function (entranceColission) {

	console.log('hubbbb',GAME.playerInEntranceFlag)

	//player is still in entrance tile
	if (TilePos(GAME.player.x) !== TilePos(entranceColission.x) || TilePos(GAME.player.y) !== TilePos(entranceColission.y) )
		return GAME.playerInEntranceFlag = false;

	//if player is no longer in entrace, but has once again entered the tile the entrance is in
	if (GAME.playerInEntranceFlag==false && TilePos(GAME.player.x) == TilePos(entranceColission.x) && TilePos(GAME.player.y) == TilePos(entranceColission.y) ) {
		if (GAME.saveData) {

			loadHubWorld();

			GAME.player.immobile = Date.now()+500;
			
			//play start sound
			zzfx(...[,,130,.07,.01,.12,1,.66,27,14,,,,,5]);
		}
		else {
			GAME.playerInEntranceFlag = true;
			alert ('You are just testing - in the real game this would bring the player back to the hub world.')
		}
	}
		

	
	if(!GAME.playerInEntranceFlag) {
		GAME.playerInTeleporterFlag = true;
	}

});