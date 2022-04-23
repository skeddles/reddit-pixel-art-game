

new TileType('hubPortal', 'none', {
	onLoad: e => e, 
});


new CollisionType('hubPortal', 'circle', function (levelWarp) {


	console.log('loading level',levelWarp.levelName)

	//stop game loop execution
	GAME.ready = false;

	//get data for matching level
	fetch('/levels/'+levelWarp.levelName)
		.then(response => response.json())
		.then(mapData => {
			GAME.inHubWorld = false;
			
				
			loadMap(levelWarp.levelName, mapData);

			GAME.player.immobile = Date.now()+500; //hold player in place for short amount of time
		})
		.catch(e => console.error('error loading map',e));

});