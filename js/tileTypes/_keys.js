new CollisionType('keys', 'circle', function (keyCollission) {
	GAME.ui.keyCount++;
	//remove from stage
	GAME.level.removeChild(keyCollission);
	//remove from array
	GAME.currentMap.keys = GAME.currentMap.keys.filter(k => k !== keyCollission);
	//sound
	zzfx(...[2.08,,975,,.04,.17,1,1.63,,.2,-250,.09,.02,,,,.06,.84,.02,.2]); 
});
