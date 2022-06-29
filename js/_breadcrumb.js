


function checkBreadcrumbs () {
	if (!GAME.currentMap) return;

	//firstime setup
	if (!GAME.currentMap['breadcrumbs']) {
		GAME.breadcrumbPlaced = false;
		GAME.currentMap.breadcrumbs = {};
	}

	//unpress button / exit if not placing
	if (!INPUT.Space) return GAME.breadcrumbPlaced = false;

	//space is pressed, but we already placed the breadcrumb, so exit
	if (GAME.breadcrumbPlaced) return;

	//everything after this only happens when the key is first pressed down -- wont trigger again until this value is set back to false;
	GAME.breadcrumbPlaced = true;


	//get coordinates of player
	let currentX = TilePos(GAME.player.x);
	let currentY = TilePos(GAME.player.y);
	let position = 'x'+currentX+'y'+currentY;
	let crumbAtCurrentPosition = GAME.currentMap.breadcrumbs[position];
	//if theres already a breadcrumb at this postion, destroy it and exit
	if (crumbAtCurrentPosition) {
		console.log('already a breadcrumb at',position);
		
		GAME.level.removeChild(crumbAtCurrentPosition);
		GAME.currentMap.breadcrumbs[position] = false;
		zzfx(...[.4,,335,.05,,.09,4,.72,50,,,,,,,,,.79,.05]);
		return;
	}

	//create sprite
	let sprite = PIXI.Sprite.from('images/breadcrumb.png');
	sprite.x = round(TILESIZE * currentX + TILESIZE/4 + (TILESIZE/2*Math.random()));
	sprite.y = round(TILESIZE * currentY + TILESIZE/4 + (TILESIZE/2*Math.random()));
	GAME.level.addChild(sprite);

	//mark the space as having a breadcrumb, linking to the sprite
	GAME.currentMap.breadcrumbs[position] = sprite;

	zzfx(...[.9,,167,.03,.01,.08,4,1.54,,,,,,,,.9,,.5,.01]);

	console.log('place breadcrumb at '+position)
}