
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
	if (listOfUnlockedLevels.length == GAME.levelList.length)
		return console.log('no more levels to unlock');

	//find a level that hasn't been unlocked yet
	let randomLevel;
	do {
		randomLevel = arandom(GAME.levelList);
		console.log('dis?',listOfUnlockedLevels.includes(randomLevel))
	} while (listOfUnlockedLevels.includes(randomLevel))
		console.log('found level to unlock', randomLevel);

	//add to save data
	GAME.saveData.unlockedLevels[randomLevel] = {
		complete: false,
		foundCollectables: [],
	}

	//save the game
	saveGame();
}

function saveGame () {
	console.log('saving game', GAME.saveData);
	localStorage.setItem('redditGameSaveData', JSON.stringify(GAME.saveData));
	console.log('game saved');
}