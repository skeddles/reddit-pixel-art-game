var pp= 0;

function loadMap (mapName, mapData) {
	console.log('loading map', mapData);

	//clearing game of all objects
	while(GAME.app.stage.children[0])
		GAME.app.stage.removeChild(GAME.app.stage.children[0]);

	//iniitalize current map data
	GAME.currentMap = mapData;
	GAME.currentMap.levelName = mapName;
	GAME.level = new PIXI.Container();
		GAME.level.sortableChildren = true; //enables z-ordering
	GAME.app.stage.addChild(GAME.level);

//LEVEL

	//load background image
	GAME.currentMap.bg = PIXI.Sprite.from(mapData.backgroundImage);
	GAME.level.addChild(GAME.currentMap.bg);

//SPRITESHEET


	GAME.currentMap.spriteSheetTexture = mapData.objectSpriteSheet || 'images/spritesheet.png';
	let spriteSheetTexture = new PIXI.BaseTexture(GAME.currentMap.spriteSheetTexture);
	
	GAME.currentMap.spritesheet = new PIXI.Spritesheet(spriteSheetTexture, GAME.spriteSheetData);
	GAME.currentMap.spritesheet.parse(e => console.log('spritesheet textures have been loaded'));
	
	loadPlayer(mapData);

// Window Layer
	GAME.level.windowLayer = new PIXI.Container();
		GAME.level.windowLayer.zIndex = 2; //keeps on top of player
		GAME.level.addChild(GAME.level.windowLayer);

//USER Interface
	GAME.ui = new PIXI.Container();
	GAME.app.stage.addChild(GAME.ui);

//TILES
	//load all types of tiles
	GAME.tileTypes.forEach(type => type.load());

	debug.onLoad();

	drawTitle(mapData);

//START
	GAME.ready = true;
	//play start sound
	zzfx(...[,,130,.07,.01,.12,1,.66,27,14,,,,,5]);

	playSong(mapData.music);
}

function drawTitle (mapData) {

	//text showing level name
	let titleText = new PIXI.Container();
		GAME.ui.addChild(titleText);

		//black box behind title
		titleText.bg = new PIXI.Graphics();
		titleText.bg.beginFill(0x000000, 0.33);
		titleText.bg.drawRect(0, -8+ (GAME.app.renderer.height / GAME.app.stage.scale.y) / 2, (GAME.app.renderer.width / GAME.app.stage.scale.x), 20); // x, y, width, height
		titleText.addChild(titleText.bg);

	//STAGE TITLE
		//minor collectables text (SHADOW FIRST)
		titleText.shadow = new PIXI.Text(mapData.title,{fontFamily :"Press Start 2P", fontSize: 8, fill : 0x000000, align : 'center'});
			titleText.shadow.x = (GAME.app.renderer.width / GAME.app.stage.scale.x) + 100;
			titleText.shadow.y = 1+ (GAME.app.renderer.height / GAME.app.stage.scale.y) / 2;
			titleText.shadow.anchor.set(0.5,0.5);
			titleText.addChild(titleText.shadow);
		//actual text
		titleText.color =new PIXI.Text(mapData.title,{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'center'});
			titleText.color.x =  (GAME.app.renderer.width / GAME.app.stage.scale.x) + 100;
			titleText.color.y = (GAME.app.renderer.height / GAME.app.stage.scale.y) / 2;
			titleText.color.anchor.set(0.5,0.5);
			titleText.addChild(titleText.color);

	//AUTHOR NAME
		//minor collectables text (SHADOW FIRST)
		titleText.authorShadow = new PIXI.Text('/u/'+mapData.author,{fontFamily :"Press Start 2P", fontSize: 8, fill : 0x000000, align : 'center'});
			titleText.authorShadow.x = -99;
			titleText.authorShadow.y = 8.5+ (GAME.app.renderer.height / GAME.app.stage.scale.y) / 2;
			titleText.authorShadow.anchor.set(0.5,0.5);
			titleText.authorShadow.scale.set(0.5,0.5);
			titleText.addChild(titleText.authorShadow);
		//actual text
		titleText.authorColor =new PIXI.Text('/u/'+mapData.author,{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xa3eef6, align : 'center'});
			titleText.authorColor.x = -100;
			titleText.authorColor.y = 8+ (GAME.app.renderer.height / GAME.app.stage.scale.y) / 2;
			titleText.authorColor.anchor.set(0.5,0.5);
			titleText.authorColor.scale.set(0.5,0.5);
			titleText.addChild(titleText.authorColor);

	//ANIMATION TARGET X LOCATIONS
	titleText.titleXTarget = (GAME.app.renderer.width / GAME.app.stage.scale.x) / 2;
	titleText.authorXTarget = (GAME.app.renderer.width / GAME.app.stage.scale.x) / 2;

	//put into game object so it can be rendered animated
	titleText.phase = 0;
	GAME.titleText = titleText;
}



function animateTitleText () {
	if (!GAME.titleText) return;
	let tt = GAME.titleText;

	let x = lerp(tt.color.x, tt.titleXTarget, 0.05);
		tt.color.x = x;
		tt.shadow.x = x + 1;

	let xA = lerp(tt.authorColor.x, tt.authorXTarget, 0.05);
		tt.authorColor.x = xA;
		tt.authorShadow.x = xA + 1;

	//if triggered, fade out the bg (starts after text stops in middle)
 	if (tt.fadeOut) 
	 	tt.bg.alpha = lerp(tt.bg.alpha, 0, 0.05);

	//text has reached middle of screen
	if (tt.phase==0 && round(x) == tt.titleXTarget && round(xA) == tt.authorXTarget) {
		console.log('title animation complete');
		tt.phase = 1; //text is in middle

		//wait a bit, then start moving them away
		setTimeout(()=>{
			tt.titleXTarget = -100;
			tt.authorXTarget = (GAME.app.renderer.width / GAME.app.stage.scale.x) + 100;
			tt.fadeOut = true;
			tt.phase = 2; //text is moving off screen

		}, 500);
	}

	//text has reach ending point, meaning the animation is done
	else if (tt.phase==2 && round(x) == tt.titleXTarget) {
		

		//complete - destroy title text
		GAME.ui.removeChild(tt);
		GAME.titleText = null;
	}
}