



new TileType('keys', [0,255,255], {
	maxNumberAllowed: 99,
	uiInit: ()=> {
		//keys number text
		GAME.ui.keys = new PIXI.Text('0',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'left'});
		GAME.ui.keys.y = (GAME.app.renderer.height / GAME.app.stage.scale.y) - 8;
		GAME.ui.addChild(GAME.ui.keys);
		GAME.ui.keyCount = 0;
	},
	uiUpdate: ()=> {
		GAME.ui.keys.text = GAME.ui.keyCount;
	}
});


new CollisionType('keys', 'circle', function (keyCollission) {
	GAME.ui.keyCount++;
	//remove from stage
	GAME.level.removeChild(keyCollission);
	//remove from array
	GAME.currentMap.keys = GAME.currentMap.keys.filter(k => k !== keyCollission);
	//sound
	zzfx(...[2.08,,975,,.04,.17,1,1.63,,.2,-250,.09,.02,,,,.06,.84,.02,.2]); 
});
