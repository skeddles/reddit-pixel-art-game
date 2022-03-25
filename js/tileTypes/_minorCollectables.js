new CollisionType('minorCollectables', 'circle', function (minorCollectableCollission) {
	//remove from stage
	GAME.level.removeChild(minorCollectableCollission);
	//remove from array
	GAME.currentMap.minorCollectables =  GAME.currentMap.minorCollectables.filter(c => c !== minorCollectableCollission);
	//sound
	zzfx(...[1.02,,1596,.01,.04,,1,1.63,,,,,,,,,,.52,.03]);
});
