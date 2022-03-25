new CollisionType('doors', 'rect', function (doorCollission) {
	console.log('door')
	if (GAME.ui.keyCount < 1) return;

	GAME.ui.keyCount--;

	//remove from stage
	GAME.level.removeChild(doorCollission);

	//remove from array
	GAME.currentMap.doors = GAME.currentMap.doors.filter(k => k !== doorCollission);

	//sound
	zzfx(...[2.33,,301,.01,.04,.04,1,2.63,,,,,,.9,,.2,.14,.87,.03,.08]);
});