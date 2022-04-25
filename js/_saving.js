
//get list of available levels
fetch('level-list.json')
	.then(response => response.json())
	.then(data => {
		GAME.levelList = data;
		console.log('got level data', GAME.levelList );
	})
	.catch(error => console.log(error));

function startGame() {
	GAME.saveData = localStorage.getItem('redditGameSaveData');

	//attempt to parse save data into object
	if (GAME.saveData) {
		try {
			GAME.saveData = JSON.parse(GAME.saveData);
			console.log('loaded save data', GAME.saveData);
		}
		catch (e) {
			alert('there was an problem loading your save data');
			delete GAME.saveData;
		}
	}

	//no save data was found, create it now
	if (!GAME.saveData) {
		console.log('save data not found, creating new save')
		GAME.saveData = {
			unlockedLevels: {}
		}

		//unlock 2 levels by default
		unlockLevel();
		unlockLevel();
	}

	//start game
	loadHubWorld();
}

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
			0, //one value should always be 0
			1, //one value should always be 1
			Math.random(), //one value should be random
		].shuffle())

		console.log(portalColor)
	
	//find coordinate to spawn portal at
	let x, y;
	let startNoSpawnZone = HUBWORLDSIZE/2 - 5, endNoSpawnZone = HUBWORLDSIZE/2 + 5;
	do {
		x = irandom(Math.floor(HUBWORLDSIZE/3)-1) * 3 + 2;
		y = irandom(Math.floor(HUBWORLDSIZE/3)-1) * 3 + 2;
	} while(
		//coordinate is in the middle too close to player
		(x.isBetween(startNoSpawnZone,endNoSpawnZone) && y.isBetween(startNoSpawnZone,endNoSpawnZone) ) 
		//coordinate is already used by another level
		|| alreadyALevelAtTheseCoordinates(x,y)
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

function saveGame () {
	console.log('saving game', GAME.saveData);
	localStorage.setItem('redditGameSaveData', JSON.stringify(GAME.saveData));
	console.log('game saved');
}

//updates the save data then saves the game (pass in a function that does whatever you need)
//this avoids have to check for valid save data, and save the game after, each time you need to save
function updateSaveData(updateFunction) {
	console.log('updating save data')
	if (!GAME.saveData) return console.warn('game cound\'t be saved, no save data found');
	if (GAME.currentMap.levelName == 'loadedLevel')  return console.warn('game cound\'t be saved, currently in test level');

	//run the new change
	updateFunction();

	//save the new data
	saveGame();
}

function clearSaveData () {
	clearOpenSaveGame();
	localStorage.removeItem('redditGameSaveData');
}


function clearOpenSaveGame () {
	saveGame();
	delete GAME.saveData;
}

function alreadyALevelAtTheseCoordinates (x,y) {

	let levels = Object.keys(GAME.saveData.unlockedLevels);
	
	//loop through all levels, if one has the same x and y, return true
	for (let i = 0; i < levels.length; i++)
		if (GAME.saveData.unlockedLevels[levels[i]].x == x && GAME.saveData.unlockedLevels[levels[i]].y == y)
			return true;
	
	//no matching level found
	return false;
}