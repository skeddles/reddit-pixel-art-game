new CollisionType('mainCollectable', 'rect', 
	function () {
		GAME.level.removeChild(GAME.currentMap.mainCollectable);
		zzfx(...[,,730,,.06,.18,1,.23,,9.8,-158,.04,,,,,,.63,.05]);
		delete GAME.currentMap.mainCollectable;
	}
);
