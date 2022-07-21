
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
		loadCutscene(INTRO_TEXT, 'portrait-confused', ()=>{
			createSaveData();
			loadHubWorld();
		});
	}

	//user has save data, load their hub world
	else {
		loadHubWorld();
	}	
}

function createSaveData () {
	console.log('save data not found, creating new save')
	GAME.saveData = {
		unlockedLevels: {}
	}

	//unlock 2 levels by default
	unlockLevel();
	unlockLevel();
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
	updateFunction(GAME.saveData);

	//save the new data
	saveGame();
}

function clearSaveData () {
	clearOpenSaveGame();
	localStorage.removeItem('redditGameSaveData');
}


function clearOpenSaveGame () {
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