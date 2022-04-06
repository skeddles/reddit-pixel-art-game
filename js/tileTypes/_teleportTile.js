new TileType('teleporters',[142,142,142], {
	maxNumberAllowed: 2,
	minNumberAllowed: 2,
	onLoad: (object)=>{

		// create an animated sprite
		let sprite = new PIXI.AnimatedSprite(GAME.currentMap.spritesheet.animations['teleport1']);

		// set speed, start playback and add it to the stage
		sprite.animationSpeed = 0.167; 
		sprite.play();

		sprite.x = TILESIZE * object.x;
		sprite.y = TILESIZE * object.y;
		GAME.level.addChild(sprite);
		if(!GAME.TeleportSquares){
			GAME.TeleportSquares = [];
		}
		GAME.TeleportSquares.push(object);
		return sprite;

	}
});

new CollisionType('teleporters', 'circle', function (keyCollission) {
	const playerGridX = round(GAME.player.x/TILESIZE);
	const playerGridY = round(GAME.player.y/TILESIZE);
	const playerGridPos = { 
		x : round(GAME.player.x/TILESIZE),
		y : round(GAME.player.y/TILESIZE)
	};

	// find the index of the teleporter on the grid square the player is standing
	// it might not be found and return -1 
	const playerTeleportIndex = GAME.TeleportSquares.map( e => { return JSON.stringify(e); }) 
													.indexOf(JSON.stringify(playerGridPos));
	if(playerTeleportIndex >= 0){
		if(!GAME.playerInTeleporterFlag){
			GAME.playerInTeleporterFlag = true;
			let otherTeleporter = GetOtherTeleporter(playerTeleportIndex);
			GAME.player.x = otherTeleporter.x * TILESIZE;
			GAME.player.y = otherTeleporter.y * TILESIZE;
			zzfx(...[2.52,0,65.40639,,.63,,1,1.02,,,29,,.22,.3,,.1,.02,.32,.18,.9]); 
		}
		
	}
	else{
		GAME.playerInTeleporterFlag = false; //the player is colliding with the teleporter but isn't in the square
	}
});

function GetOtherTeleporter(playerTeleportIndex){
	let otherTeleporter = null;
	if(playerTeleportIndex == 0)      otherTeleporter = GAME.TeleportSquares[1];
	else if(playerTeleportIndex == 1) otherTeleporter = GAME.TeleportSquares[0];
	else console.error("There should be exactly 2 teleporter tiles - validating the map png must have failed");
	return otherTeleporter;
}
