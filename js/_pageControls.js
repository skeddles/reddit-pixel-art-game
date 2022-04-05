

/*
//clicked the full screen button
$('.game .full-screen').addEventListener('click', e=> {
	$('.game .view').requestFullscreen();
});*/

//clicked the load level
$('.game .load-level').addEventListener('click', e=> {
	
});

//clicked the load level
$('.game .load-example-level').addEventListener('click', e=> {
	fetch('/levels/test-level-0-reddit-game-level.json')
		.then(response => response.json())
		.then(exampleMapData => {
			loadMap(exampleMapData);
		})
		.catch(e => console.error('error loading map',e));
});