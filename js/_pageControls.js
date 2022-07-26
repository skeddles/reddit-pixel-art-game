


//clicked the full screen button
$('.game .full-screen').addEventListener('click', e=> {
	$('.game .view').requestFullscreen();

	GAME.app.renderer.resize(screen.width, screen.height);

	let zoom = ceil(screen.height / 90);
		console.log('zooming',screen.width, screen.height, zoom);

	GAME.app.stage.scale.set(zoom);
	

});

$('.game .view').addEventListener('fullscreenchange', e => { 
	console.log('fullscreenchange', document.fullscreenElement)

	//if there is no full screen element
	if (!document.fullscreenElement) {
		GAME.app.renderer.resize(640, 360);
		GAME.app.stage.scale.set(4);
	}
});




//clicked the load level
// $('.game .start-game').addEventListener('click', e=> {
// 	startGame();
// });

//clicked the load level
// $('.game .load-level').addEventListener('click', e=> {
	
// });


//clicked the load level
// $('.game .watch-credits').addEventListener('click', e=> {
// 	document.body.scrollTop = document.documentElement.scrollTop = 0; //scroll to top of page
// 	loadCredits();
// });
 
//clicked the load level
// $('.game .load-example-level').addEventListener('click', e=> {

// 	clearOpenSaveGame();

// 	const testLevelName = 'test-level-3-reddit-game-level.json';

// 	fetch('/levels/'+testLevelName)
// 		.then(response => response.json())
// 		.then(exampleMapData => {
// 			loadMap(testLevelName, exampleMapData);
// 		})
// 		.catch(e => console.error('error loading map',e));
// });


//clicked the load level
$('.game .clear-save-data').addEventListener('click', e=> {
	if (confirm('Are you sure you want to delete all save data from the game?')) {
		clearSaveData();
		alert('Save data has been erased.')
	}
});