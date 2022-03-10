
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

//objec that holds all live game data
let GAME = {
	app: new PIXI.Application({ 
		width: 640, 
		height: 360,
		roundPixels: true
	}),
};

GAME.app.stage.scale.set(4)

//add to page
$('.game .view').appendChild(GAME.app.view); 


let elapsed = 0.0;

const SPEED = 1.25;	



function gameLoop (delta) {
	elapsed += delta;

	//initialize speed calculation
	let hspeed=0, vspeed=0, normalizer=1;

	if (!GAME.currentMap) return;

	//determing direction
	if (INPUT.KeyD) hspeed = 1;
	if (INPUT.KeyA) hspeed = -1;
	if (INPUT.KeyW) vspeed = -1;
	if (INPUT.KeyS) vspeed = 1;

	//determine normalizer (this makes diagonal speed slower to match horizontal/vertical speed)
	if (hspeed !== 0 && vspeed !== 0) normalizer = 0.7071;

	//calculate new player coordinates after moving
	let playerNewX = GAME.player.x + hspeed * SPEED * delta * normalizer;
	let playerNewY = GAME.player.y + vspeed  * SPEED * delta * normalizer;


	//calculate which spot on the grid the player is currently in
	let playerGridX = round(GAME.player.x/TILESIZE);
	let playerGridY = round(GAME.player.y/TILESIZE);

	if (DEBUG) {
		GAME.currentMap.playerSquare.x = playerGridX * TILESIZE;
		GAME.currentMap.playerSquare.y = playerGridY * TILESIZE;
		GAME.currentMap.targetSquare.x = (playerGridX+hspeed) * TILESIZE;
		GAME.currentMap.targetSquare.y = (playerGridY+vspeed) * TILESIZE;		
	}


	//check if player is okay to move to these new coordinates
	if (isFree(playerNewX,playerNewY)) {
		//move player sprite
		GAME.player.x = playerNewX;
		GAME.player.y = playerNewY;

		//MAIN COLLECTABLE collission
		if (GAME.currentMap.mainCollectable && circleRectCollission({
				//player
				x: GAME.player.x+TILESIZE/2, 
				y: GAME.player.y+TILESIZE/2, 
				radius: (TILESIZE-2)/2
			},{	
				//collectable
				left: GAME.currentMap.mainCollectable.x,
				top: GAME.currentMap.mainCollectable.y,
				right: GAME.currentMap.mainCollectable.x+TILESIZE,
				bottom: GAME.currentMap.mainCollectable.y+TILESIZE,
			})) {
				GAME.app.stage.removeChild(GAME.currentMap.mainCollectable);
				zzfx(...[,,730,,.06,.18,1,.23,,9.8,-158,.04,,,,,,.63,.05]);
				delete GAME.currentMap.mainCollectable;
			}
		
		//MINOR COLLECTABLE collission
		else {
			let minorCollectableCollission = GAME.currentMap.minorCollectables.find(collectable => circleCircleCollission({
				//player
				x: GAME.player.x+TILESIZE/2, 
				y: GAME.player.y+TILESIZE/2, 
				radius: (TILESIZE-2)/2
			},{
				//collectable
				x: collectable.x + TILESIZE/2, 
				y: collectable.y + TILESIZE/2, 
				radius: (TILESIZE-2)/2
			}));

			if (minorCollectableCollission) {
				console.log('collectabled', minorCollectableCollission);
				//remove from stage
				GAME.app.stage.removeChild(minorCollectableCollission);
				//remove from array
				GAME.currentMap.minorCollectables =  GAME.currentMap.minorCollectables.filter(c => c !== minorCollectableCollission);
				//sound
				zzfx(...[1.02,,1596,.01,.04,,1,1.63,,,,,,,,,,.52,.03]);
			}

			let killTileCollission = GAME.currentMap.killTiles.find(tile => circleRectCollission({
				//player
				x: GAME.player.x+TILESIZE/2, 
				y: GAME.player.y+TILESIZE/2, 
				radius: (TILESIZE-2)/2
			},{
				//tile
				left: tile.x*TILESIZE,
				top: tile.y*TILESIZE,
				right: tile.x*TILESIZE+TILESIZE,
				bottom: tile.y*TILESIZE+TILESIZE,
			}));

			if (killTileCollission) {
				console.log('killTileCollission', killTileCollission);

				//sound
				zzfx(...[1.09,,373,,.25,.42,4,2.97,.6,,,,.19,.7,-4.4,.7,,.42,.03]);

				GAME.player.x = TILESIZE * GAME.currentMap.startingLocation.x;
				GAME.player.y = TILESIZE * GAME.currentMap.startingLocation.y;
			}

		}
		
			
	}
	//there is some sort of collission
	else {

		//if you're not trying to move diagonally...
		if ((hspeed==0||vspeed==0)) {
			//...and the space in front of you is free
			if (!spaceHasWall(playerGridX+hspeed, playerGridY+vspeed)) {
				console.log('SMOOSHING',playerGridY,);
				//if the space to the left or right is free, smoosh the player vertically
				if (hspeed !== 0) 
					GAME.player.y = round((GAME.player.y + (playerGridY * TILESIZE))/2 ) //SMOOSH (move the player towards the center of the tile they're currently in)
				//if the space to the top or bottom is free, smoosh the player horiztonally
				if (vspeed !== 0) 
					GAME.player.x = round((GAME.player.x + (playerGridX * TILESIZE))/2 ) //SMOOSH (move the player towards the center of the tile they're currently in)
			}
		}

		//you are trying to move diagonally
		else {
			//if the player could still move one of the directions, do that (this makes it so you can go around corners moving diagonally)
			if (isFree(playerNewX,GAME.player.y)) GAME.player.x += hspeed * SPEED * delta ;
			if (isFree(GAME.player.x,playerNewY)) GAME.player.y += vspeed * SPEED * delta ;
		}
	}
	
	//if the player isnt moving, snap the players position to a pixel (as long as it wouldn't cause a collission)
	if (hspeed==0 && vspeed ==0) {
		let roundedX = round(GAME.player.x);
		let roundedY = round(GAME.player.y);
		if (isFree(roundedX,roundedY)) {
			GAME.player.x = roundedX;
			GAME.player.y = roundedY;
		}
	}

	//make the camera follow the player (smoothing the motion slightly with lerping)
	GAME.app.stage.x = lerp(GAME.app.stage.x, (-TILESIZE/2 - GAME.player.x) * GAME.app.stage.scale.x + (GAME.app.renderer.width/2), 0.1);
	GAME.app.stage.y = lerp(GAME.app.stage.y, (-TILESIZE/2 - GAME.player.y) * GAME.app.stage.scale.y + (GAME.app.renderer.height/2), 0.1);

	//TODO: Make camera stop at edges of maps
};



//start game loop
GAME.app.ticker.add(gameLoop);