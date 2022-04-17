

//key: teleporter number, property: teleporter color
GAME.teleportersData = {
	1: [96,0,255],
	2: [128,0,255],
	3: [160,0,255],
	4: [192,0,255]
};

Object.keys(GAME.teleportersData).forEach(teleportId => {

	new TileType('teleport'+teleportId, GAME.teleportersData[teleportId], {
		maxNumberAllowed: 2,
		minNumberAllowed: 2,
		onLoad: (object)=>{

			// create an animated sprite
			let sprite = new PIXI.AnimatedSprite(GAME.currentMap.spritesheet.animations['teleport'+teleportId]);
				sprite.animationSpeed = 0.167; 
				sprite.play();
				sprite.x = TILESIZE * object.x;
				sprite.y = TILESIZE * object.y;
				GAME.level.addChild(sprite);
				sprite.teleportId = teleportId;

			return sprite;
		}
	});

	new CollisionType('teleport'+teleportId, 'circle', function (keyCollission) {
		let id = keyCollission.teleportId;

		// find the index of the teleporter on the grid square the player is standing
		// it might not be found and return -1 
		const teleportIndex = GAME.currentMap['teleport'+id]									
			.indexOf(keyCollission);

		//if the player has left the tile
		if (TilePos(GAME.player.x) !== TilePos(keyCollission.x) || TilePos(GAME.player.y) !== TilePos(keyCollission.y) )
			return GAME.playerInTeleporterFlag = false;

			if(!GAME.playerInTeleporterFlag) {
				GAME.playerInTeleporterFlag = true;

				let otherTeleporter = GetOtherTeleporter(id, teleportIndex);
				GAME.player.x = otherTeleporter.x;
				GAME.player.y = otherTeleporter.y;
				GAME.player.immobile = Date.now()+350; //hold player in place for short amount of time

				zzfx(...[2.52,0,65.40639,,.63,,1,1.02,,,29,,.22,.3,,.1,.02,.32,.18,.9]); 
			}

	});
});




function GetOtherTeleporter(id, teleportIndex){

	if (teleportIndex == 0)      return GAME.currentMap['teleport'+id][1];
	else if (teleportIndex == 1) return GAME.currentMap['teleport'+id][0];
	
	//failed to find teleporter
	console.error("There should be exactly 2 teleporter tiles - validating the map png must have failed");
	return null;
}
