

//key: door number, property: door color
GAME.doorData = {
	1: [0,0,255],
	2: [178,34,34],
	3: [34,34,178],
	4: [34,178,34]
};


//loop through doortypes and generate
Object.keys(GAME.doorData).forEach(doorId => {

	new TileType('door'+doorId, GAME.doorData[doorId], {});

	new CollisionType('door'+doorId, 'rect', function (doorCollission) {
		
		let doorId = doorCollission.tileType;

		//remove key from player
		GAME.ui.keys.removeChild(findMatchingKey(doorId));
			arrangeKeysOnUI();

		//remove door from stage
		GAME.level.removeChild(doorCollission);

		//remove from array
		GAME.currentMap[doorId] = GAME.currentMap[doorId].filter(k => k !== doorCollission);

		//sound
		zzfx(...[2.33,,301,.01,.04,.04,1,2.63,,,,,,.9,,.2,.14,.87,.03,.08]);
	});

});