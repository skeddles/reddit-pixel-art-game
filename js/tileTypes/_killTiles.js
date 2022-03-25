new CollisionType('killTiles', 'rect', 
	function () {

		//sound
		zzfx(...[1.09,,373,,.25,.42,4,2.97,.6,,,,.19,.7,-4.4,.7,,.42,.03]);

		GAME.currentMap.lives--;

		GAME.player.x = TILESIZE * GAME.currentMap.startingLocation.x;
		GAME.player.y = TILESIZE * GAME.currentMap.startingLocation.y;
	}
);
