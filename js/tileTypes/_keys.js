
//key: key number, property: key color
GAME.keyData = {
	1: [0,255,255],
	2: [226,34,34],
	3: [34,34,226],
	4: [34,226,34]
};

//loop through keytypes and generate
Object.keys(GAME.keyData).forEach(keyId => {

	new TileType('key'+keyId, GAME.keyData[keyId], {
		maxNumberAllowed: 99,
		uiInit: ()=> {

			//add keyholder to UI (only once)
			if (!GAME.ui.keys) {
				GAME.ui.keys = new PIXI.Container();
					GAME.ui.keys.x = 1;
					GAME.ui.keys.y = (GAME.app.renderer.height / GAME.app.stage.scale.y) - 8;
					GAME.ui.addChild(GAME.ui.keys);
			}

		},
		uiUpdate: ()=> {
			//GAME.ui.keys.text = GAME.ui.keyCount;
		}
	});


	new CollisionType('key'+keyId, 'circle', function (keyCollission) {

		console.log(keyCollission)
		let keyId = keyCollission.tileType;

		let newKeyIcon = new PIXI.Sprite(GAME.currentMap.spritesheet.textures[keyId]);
			newKeyIcon.scale.set(0.5,0.5);
			newKeyIcon.keyId = keyId;
			GAME.ui.keys.addChild(newKeyIcon);
		
			arrangeKeysOnUI();

		//remove key from stage
		GAME.level.removeChild(keyCollission);
		//remove key from array
		GAME.currentMap[keyId] = GAME.currentMap[keyId].filter(k => k !== keyCollission);
		//sound
		zzfx(...[2.08,,975,,.04,.17,1,1.63,,.2,-250,.09,.02,,,,.06,.84,.02,.2]); 
	});
});

function arrangeKeysOnUI () {
	//loop through collected keys
	GAME.ui.keys.children.forEach( (key, i) => {
		key.x = (TILESIZE/2+1) * i;
	});
}

function findMatchingKey (doorId) {
	let keyId = doorId.replace('door','key');

	//loop through collected keys
	return GAME.ui.keys.children.find(k => k.keyId == keyId);
}