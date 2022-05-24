
new TileType('killTiles', [255,0,0], {
	onLoad: kt => ({
		x: kt.x * TILESIZE,
		y: kt.y * TILESIZE,
		w: TILESIZE/2,
		h: TILESIZE/2,
	}),
	uiInit: ()=> {
		//lives counter
		GAME.currentMap.lives = 3;

		//container that holds the life images
		let container = new PIXI.Container();
			container.x=1;
			container.y=1;
			GAME.ui.addChild(container);
		
		//gray hearts that show empty lives
		let emptyLives = PIXI.Sprite.from('images/lives-empty.png');
			container.addChild(emptyLives);
		
		//icon for 2 or more lives
		GAME.ui.lifeIcon2 = PIXI.Sprite.from('images/lives.png');
			GAME.ui.lifeIcon2.x = 10;	
			container.addChild(GAME.ui.lifeIcon2);

		//icon for 3 lives (full health)
		GAME.ui.lifeIcon3 = PIXI.Sprite.from('images/lives.png');
			GAME.ui.lifeIcon3.x = 20;
			container.addChild(GAME.ui.lifeIcon3);
	}	
});

new CollisionType('killTiles', 'rect', function (tile) {

		console.log('killtile',tile,TilePos(tile.x), TilePos(tile.y))

		if ( TilePos(GAME.player.x) !== TilePos(tile.x) ) return false;
		if ( TilePos(GAME.player.y) !== TilePos(tile.y) ) return false;

		//lose a life
		GAME.currentMap.lives--;

		//if the player has lost all lives, return them to the hub world
		if (GAME.currentMap.lives == 0)
			return loadHubWorld();

		//reflect new life count on ui
		if (GAME.currentMap.lives == 2)
			GAME.ui.lifeIcon3.destroy()
		if (GAME.currentMap.lives == 1)
			GAME.ui.lifeIcon2.destroy()

		//make sure player doesn't teleport when sent back on top of the entrance portal
		GAME.playerInEntranceFlag = true;

		GAME.player.immobile = Date.now()+500; //hold player in place for short amount of time

		//move player back to start
		GAME.player.x = GAME.currentMap.entrance[0].x;
		GAME.player.y = GAME.currentMap.entrance[0].y;
		
		//sound
		zzfx(...[1.09,,373,,.25,.42,4,2.97,.6,,,,.19,.7,-4.4,.7,,.42,.03]);
	}
);
