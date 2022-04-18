

//key: key number, property: key color
GAME.minorCollectableData = [
	[0,255,0],
	[0,221,0],
	[0,187,0]
];


GAME.minorCollectableData.forEach((color, collectableId) => {

	new TileType('minorCollectables'+collectableId, color, {
		maxNumberAllowed: 999,
		uiInit: ()=>{
			
			//update total count
			if (!GAME.ui.totalMinorCollectables) GAME.ui.totalMinorCollectables = 0;
			GAME.ui.totalMinorCollectables += GAME.currentMap['minorCollectables'+collectableId].length;

			//only trigger the rest the first time
			if (GAME.ui.hasOwnProperty('minorCollectableCount')) return; //only trigger this once

			//minor collectables text (SHADOW FIRST)
			GAME.ui.minorCollectableCountShadow = new PIXI.Text('0',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0x000000, align : 'right'});
				GAME.ui.minorCollectableCountShadow.x = (GAME.app.renderer.width / GAME.app.stage.scale.x) - 8 + 1;
				GAME.ui.minorCollectableCountShadow.y = 2;
				GAME.ui.minorCollectableCountShadow.anchor.set(1,0);
				GAME.ui.addChild(GAME.ui.minorCollectableCountShadow);
			//actual text
			GAME.ui.minorCollectableCount = new PIXI.Text('0',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'right'});
				GAME.ui.minorCollectableCount.x = (GAME.app.renderer.width / GAME.app.stage.scale.x) - 8;
				GAME.ui.minorCollectableCount.y = 1;
				GAME.ui.minorCollectableCount.anchor.set(1,0);
				GAME.ui.addChild(GAME.ui.minorCollectableCount);
			//minor collectables icon
			let mcIcon = new PIXI.Sprite(GAME.currentMap.spritesheet.textures.minorCollectables0);
				mcIcon.x = (GAME.app.renderer.width / GAME.app.stage.scale.x) - (TILESIZE*0.75) + 2;
				mcIcon.y = -2;
				mcIcon.scale.set(0.75,0.75);
				GAME.ui.addChild(mcIcon);


			GAME.ui.gotAllMinorCollectables = false;
		},
		uiUpdate: ()=> {
			let collectablesLeft = GAME.currentMap.minorCollectables0.length + GAME.currentMap.minorCollectables1.length + GAME.currentMap.minorCollectables2.length;
			GAME.ui.minorCollectableCount.text = GAME.ui.totalMinorCollectables - collectablesLeft;
			GAME.ui.minorCollectableCountShadow.text = GAME.ui.minorCollectableCount.text;

			//if the user has collected them all, change the color to gold
			if (collectablesLeft == 0 && !GAME.ui.gotAllMinorCollectables) {
				GAME.ui.gotAllMinorCollectables = true;
				GAME.ui.minorCollectableCount.style.fill = 0xfbef35;
			}
		}
	});

	new CollisionType('minorCollectables'+collectableId, 'circle', function (minorCollectableCollission) {

		let minorCollectableType = minorCollectableCollission.tileType;

		//remove from stage
		GAME.level.removeChild(minorCollectableCollission);

		//remove from array
		GAME.currentMap[minorCollectableType] =  GAME.currentMap[minorCollectableType].filter(c => c !== minorCollectableCollission);
		
		//sound
		zzfx(...[1.02,,1596,.01,.04,,1,1.63,,,,,,,,,,.52,.03]);
	});

});