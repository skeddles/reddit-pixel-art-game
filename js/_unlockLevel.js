function unlockLevel () {

	let listOfUnlockedLevels = Object.keys(GAME.saveData.unlockedLevels);

	//make sure there are still some levels to unlock
	if (listOfUnlockedLevels.length == GAME.levelList.length) {
		console.log('no more levels to unlock');
		return 0;
	}

	//find a level that hasn't been unlocked yet
	let randomLevel;
	do {
		randomLevel = arandom(GAME.levelList);
		console.log('dis?',listOfUnlockedLevels.includes(randomLevel))
	} while (listOfUnlockedLevels.includes(randomLevel))
		console.log('found level to unlock', randomLevel);

	//create random color for portal
	let portalColor = PIXI.utils.rgb2hex([
			0, // one value should always be 0
			1, // one value should always be 1
			Math.random(), // one value should be random
		].shuffle())

		console.log(portalColor)
	
	//find coordinate to spawn portal at
	let x, y;
	let startNoSpawnZone = HUBWORLDSIZE/2 - 1;
	let endNoSpawnZone = HUBWORLDSIZE/2 + 1;

	const coords = [14,17,14,17,11,20,11,20,8,23,8,23,5,27,2,30];
	
	console.log('max distance ', listOfUnlockedLevels.length+1)

	do {
		x = coords[smaller(15, irandom(listOfUnlockedLevels.length))]
		y = coords[smaller(15, irandom(listOfUnlockedLevels.length))]

		//x = irandom(Math.floor(HUBWORLDSIZE/3)-1) * 3 + 2;
		//y = irandom(Math.floor(HUBWORLDSIZE/3)-1) * 3 + 2;
	} while(
		//coordinate is too far from center
		//(!x.isBetween(startSpawnZone,endSpawnZone) && !y.isBetween(startSpawnZone,endSpawnZone) ) 
		//	||
		//coordinate is in the middle too close to player
		//(x.isBetween(startNoSpawnZone,endNoSpawnZone) && y.isBetween(startNoSpawnZone,endNoSpawnZone) ) 
		//	||
		//coordinate is already used by another level
		alreadyALevelAtTheseCoordinates(x,y)
	);

	//add to save data
	GAME.saveData.unlockedLevels[randomLevel] = {
		complete: false,
		foundCollectables: [],
		x: x,
		y: y,
		portalColor: portalColor
	}

	//save the game
	saveGame();

	return 1;
}