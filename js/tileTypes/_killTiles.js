
new TileType('killTiles', [255,0,0], {
	onLoad: kt => ({
		x: kt.x * TILESIZE,
		y: kt.y * TILESIZE,
		w: TILESIZE/2,
		h: TILESIZE/2,
	}),
	uiInit: ()=> {
		//lives number text
		GAME.ui.lives = new PIXI.Text('3',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'left'});
		GAME.ui.addChild(GAME.ui.lives);
		GAME.currentMap.lives = 3;
	},
	uiUpdate: ()=> {
		GAME.ui.lives.text = GAME.currentMap.lives;
	}
	
});

new CollisionType('killTiles', 'rect', function (tile) {

		console.log('killtile',tile,TilePos(tile.x), TilePos(tile.y))

		if ( TilePos(GAME.player.x) !== TilePos(tile.x) ) return;
		if ( TilePos(GAME.player.y) !== TilePos(tile.y) ) return;

		//lose a life
		GAME.currentMap.lives--;

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
