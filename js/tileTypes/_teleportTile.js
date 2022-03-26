new TileType('teleporters', {
	uiInit: ()=> {
		
		
	},
	uiUpdate: ()=> {
		
	},
	onLoad: (object)=>{
		console.log("teleporter loaded jim", object);
		let sprite = PIXI.Sprite.from('images/teleporters.png');
		sprite.x = TILESIZE * object.x;
		sprite.y = TILESIZE * object.y;
		GAME.level.addChild(sprite);
		if(!GAME.TeleportSquares){
			GAME.TeleportSquares = [];
		}
		GAME.TeleportSquares.push(object);
		return sprite;

	}
});

var stillInTeleporter = false;
new CollisionType('teleporters', 'circle', function (keyCollission) {
	console.log("teleporter collided");
	console.log(keyCollission);
	let g = GAME;
	const playerGridX = round(GAME.player.x/TILESIZE);
	const playerGridY = round(GAME.player.y/TILESIZE);
	const playerGridPos = { 
		x : round(GAME.player.x/TILESIZE),
		y : round(GAME.player.y/TILESIZE)
	};
	const playerTeleportIndex = GAME.TeleportSquares.map( e => { return JSON.stringify(e); })
													.indexOf(JSON.stringify(playerGridPos));
	
	if(playerTeleportIndex >= 0){
		let otherTeleporter;
		if(!stillInTeleporter){
			stillInTeleporter = true;
			if(playerTeleportIndex == 0)      otherTeleporter = GAME.TeleportSquares[1];
			else if(playerTeleportIndex == 1) otherTeleporter = GAME.TeleportSquares[0];
			else console.error("There should be exactly 2 teleporter tiles - validating the map png must have failed");
			GAME.player.x = otherTeleporter.x * TILESIZE;
			GAME.player.y = otherTeleporter.y * TILESIZE;
			zzfx(...[2.52,0,65.40639,,.63,,1,1.02,,,29,,.22,.3,,.1,.02,.32,.18,.9]); 
		}
		
	}
	else{
		stillInTeleporter = false;
	}
});
