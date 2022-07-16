
const HUBWORLDSIZE = 32; //in tiles
const HUBWORLDBGSIZE = 64; //in pixels

function loadHubWorld () {

	//if just testing a level, just display test message instead, and stop loading the hub world.
	if (!GAME.saveData) {
		GAME.playerInEntranceFlag = true;
		alert ('You are just testing - in the real game this would bring the player back to the hub world.');
		return;
	}

	//clearing game of all objects
	while(GAME.app.stage.children[0])
		GAME.app.stage.removeChild(GAME.app.stage.children[0]);

	//iniitalize current map with fake data to create hub world
	GAME.currentMap = {
		bg: {
			width: HUBWORLDSIZE*TILESIZE,
			height: HUBWORLDSIZE*TILESIZE,
		}
	};
	GAME.tileTypes.forEach(type => GAME.currentMap[type.name] = []);

	//level holder
	GAME.level = new PIXI.Container();
		GAME.level.sortableChildren = true; //enables z-ordering
		GAME.app.stage.addChild(GAME.level);

	//background image tiles
	const BGTILESPERSIDE = HUBWORLDSIZE * TILESIZE / HUBWORLDBGSIZE;
	let bg = new PIXI.Container();
	let bg2 = new PIXI.Container();
	for (let x = 0; x < BGTILESPERSIDE; x++) {
		for (let y = 0; y < BGTILESPERSIDE; y++) {
				let bgTile = PIXI.Sprite.from('images/hub-bg.png');
					bgTile.x = x * HUBWORLDBGSIZE;
					bgTile.y = y * HUBWORLDBGSIZE;
					bg.addChild(bgTile);
				let bgTile2 = PIXI.Sprite.from('images/hub-bg2.png');
					bgTile2.x = x * HUBWORLDBGSIZE;
					bgTile2.y = y * HUBWORLDBGSIZE;
					bg2.addChild(bgTile2);
		}
	}
	GAME.level.addChild(bg);
	GAME.level.addChild(bg2);


	//bg tile mask
		var myMask = new PIXI.Graphics();
		myMask.beginFill();
		//myMask.drawCircle(GAME.app.renderer.width/2, GAME.app.renderer.height/2, 100);
		myMask.drawCircle(TILESIZE/2, 0, TILESIZE*1.5);
		myMask.endFill();
		bg2.mask = myMask;


	

	//load player sprite into world
	loadPlayer({
		entrance: [{x:HUBWORLDSIZE/2,y:HUBWORLDSIZE/2}],
	});
	GAME.player.addChild(myMask);
	GAME.player.immobile = Date.now()+500;

			
	//hub ui layer
	GAME.level.hubUI = new PIXI.Container();
		GAME.level.hubUI.y = 16;
		GAME.level.hubUI.state = 0;
		GAME.app.stage.addChild(GAME.level.hubUI);

		//black box behind title
		GAME.level.hubUI.bg = new PIXI.Graphics();
		GAME.level.hubUI.bg.beginFill(0x000000, 0.5);
		GAME.level.hubUI.bg.drawRect(0, -12+ (GAME.app.renderer.height / GAME.app.stage.scale.y), (GAME.app.renderer.width / GAME.app.stage.scale.x), 20); // x, y, width, height
		GAME.level.hubUI.addChild(GAME.level.hubUI.bg);

		//text 
		GAME.level.hubUI.message = new PIXI.Text('hello FUCK',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'right'});
		GAME.level.hubUI.message.x = (GAME.app.renderer.width / GAME.app.stage.scale.x) / 2 ;
		GAME.level.hubUI.message.y = (GAME.app.renderer.height / GAME.app.stage.scale.y) - 1;
		GAME.level.hubUI.message.anchor.set(0.5,1);
		GAME.level.hubUI.message.scale.set(0.75,0.75);
		GAME.level.hubUI.addChild(GAME.level.hubUI.message);

			//check if new levels should be unlocked
	let numberOfLevelsUnlocked = Object.keys(GAME.saveData.unlockedLevels).length;
	let numberOfLevelsBeaten = Object.keys(GAME.saveData.unlockedLevels).reduce((prev,curr,i,a) => prev + (GAME.saveData.unlockedLevels[curr].complete), 0)
	let totalNumberOfLevels = GAME.levelList.length;

	//if there are still levels to unlock
	if (totalNumberOfLevels > numberOfLevelsUnlocked) {
		let levelsShouldBeUnlocked = numberOfLevelsBeaten*2 + 2;
		//and if you have unlocked enough levels to justify a new unlock
		if (numberOfLevelsUnlocked < levelsShouldBeUnlocked) {

			//loop through as many levels that should be unlocked and try to unlock them
			let levelsUnlocked = 0;
			for(let i=0;i<levelsShouldBeUnlocked-numberOfLevelsUnlocked;i++)
				levelsUnlocked += unlockLevel();

			//if levels were unlocked, show a message
			if (levelsUnlocked == 1) showMessage('Unlocked a new level!')
			else if (levelsUnlocked > 0) showMessage('Unlocked '+levelsUnlocked+' new levels!')

			saveGame();
		} console.log('not enough beaten levels to unlock new one')
	} console.log('no more levels to unlock')	


	//spawn level entrances
	Object.keys(GAME.saveData.unlockedLevels).forEach((levelName, i) => {
		let level = GAME.saveData.unlockedLevels[levelName];
		
		spawnHubPortal(levelName, level);
	});

	//ready
	GAME.ready = true;
	GAME.inHubWorld = true;
	debug.onLoad();
				
	//play start sound
	zzfx(...[,,130,.07,.01,.12,1,.66,27,14,,,,,5]);
	playSong('hubworld');
}

//display a text message at the bottom of the screen
function showMessage (text) {
	GAME.level.hubUI.message.text = text;
	GAME.level.hubUI.state = 1;
}

function animateHubText () {
	
	if (GAME.level.hubUI.state !== 0) console.log(GAME.level.hubUI.state)

	//move up
	if (GAME.level.hubUI.state == 1) {
		GAME.level.hubUI.y -= 1;
		//text reached top position
		if (GAME.level.hubUI.y <= 0) {
			GAME.level.hubUI.state = 2;
			setTimeout(()=>{GAME.level.hubUI.state = 3;}, 2000); //keep message for Xms, then change to moving down state
		}
		return;
	}

	//move down
	if (GAME.level.hubUI.state == 3) {
		GAME.level.hubUI.y += 1;
		//text reached bottom position
		if (GAME.level.hubUI.y >= 16) {
			GAME.level.hubUI.state = 0;
		}
		return;
	}
}

function spawnHubPortal (levelName, level) {


	let spriteHolder = new PIXI.Container();
		spriteHolder.x = TILESIZE * level.x;
		spriteHolder.y = TILESIZE * level.y;
		GAME.level.addChild(spriteHolder);

	let sprite = new PIXI.AnimatedSprite(GAME.portalSpriteSheet.animations.animation);
		sprite.x = -5;
		sprite.y = -5;
		sprite.animationSpeed = 0.167; 
		sprite.play();
		sprite.tint = level.portalColor;
		spriteHolder.addChild(sprite);

	//used for looking up the level info when colliding with portal
	spriteHolder.levelName = levelName;

	GAME.currentMap.hubPortal.push(spriteHolder);
}

//the spritesheet json data which will get parsed by new PIXI.SpriteSheet().parse()
GAME.hubWorldPortalData = {
	frames: {
		f1: {"frame": {x: 0,y:0,w:25,h:21},	 	"sourceSize": {w:25,h:21},	"spriteSourceSize": {x:0,y:0,w:25,h:21}},
		f2: {"frame": {x: 25,y:0,w:25,h:21},	"sourceSize": {w:25,h:21},	"spriteSourceSize": {x:0,y:0,w:25,h:21}},
		f3: {"frame": {x: 50,y:0,w:25,h:21},	"sourceSize": {w:25,h:21},	"spriteSourceSize": {x:0,y:0,w:25,h:21}},
		f4: {"frame": {x: 75,y:0,w:25,h:21},	"sourceSize": {w:25,h:21},	"spriteSourceSize": {x:0,y:0,w:25,h:21}},
	},
	meta: {
		app: "https://github.com/skeddles/reddit-pixel-art-game",
		version: "1.0",
		image: "hub-portal.png",
		format: "RGBA8888",
		size: {w:100,h:21},
		scale: 1
	},
	animations: {
		animation: ['f1','f2','f3','f4'],
	},
}

let portalTexture = new PIXI.BaseTexture('images/hub-portal.png');
GAME.portalSpriteSheet = new PIXI.Spritesheet(portalTexture, GAME.hubWorldPortalData);
GAME.portalSpriteSheet.parse(e => console.log('hub portal spritesheet been loaded'));
