
new TileType('minorCollectables', [0,255,0], {
	maxNumberAllowed: 999,
	uiInit: ()=>{
		//minor collectables text
		GAME.ui.minorCollectableCount = new PIXI.Text('0',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'right'});
		GAME.ui.minorCollectableCount.x = (GAME.app.renderer.width / GAME.app.stage.scale.x);
		GAME.ui.minorCollectableCount.anchor.set(1,0);
		GAME.ui.addChild(GAME.ui.minorCollectableCount);
		GAME.ui.totalMinorCollectables = GAME.currentMap.minorCollectables.length;
	},
	uiUpdate: ()=> {
		GAME.ui.minorCollectableCount.text = GAME.ui.totalMinorCollectables - GAME.currentMap.minorCollectables.length;
	}
});

new CollisionType('minorCollectables', 'circle', function (minorCollectableCollission) {
	//remove from stage
	GAME.level.removeChild(minorCollectableCollission);
	//remove from array
	GAME.currentMap.minorCollectables =  GAME.currentMap.minorCollectables.filter(c => c !== minorCollectableCollission);
	//sound
	zzfx(...[1.02,,1596,.01,.04,,1,1.63,,,,,,,,,,.52,.03]);
});
