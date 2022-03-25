


function initializeUI () {
	GAME.ui = new PIXI.Container();
	GAME.app.stage.addChild(GAME.ui);

	//lives number text
	GAME.ui.lives = new PIXI.Text('3',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'left'});
	GAME.ui.addChild(GAME.ui.lives);
	GAME.currentMap.lives = 3;

	//main collectable text
	GAME.ui.mainCollectableFound = new PIXI.Text('',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'right'});
	GAME.ui.mainCollectableFound.x = (GAME.app.renderer.width / GAME.app.stage.scale.x) / 2 ;
	GAME.ui.mainCollectableFound.y = (GAME.app.renderer.height / GAME.app.stage.scale.y);
	GAME.ui.mainCollectableFound.anchor.set(0.5,1);
	GAME.ui.addChild(GAME.ui.mainCollectableFound);

	//minor collectables text
	GAME.ui.minorCollectableCount = new PIXI.Text('0',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'right'});
	GAME.ui.minorCollectableCount.x = (GAME.app.renderer.width / GAME.app.stage.scale.x);
	GAME.ui.minorCollectableCount.anchor.set(1,0);
	GAME.ui.addChild(GAME.ui.minorCollectableCount);
	GAME.ui.totalMinorCollectables = GAME.currentMap.minorCollectables.length;

	//keys number text
	GAME.ui.keys = new PIXI.Text('0',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'left'});
	GAME.ui.keys.y = (GAME.app.renderer.height / GAME.app.stage.scale.y) - 8;
	GAME.ui.addChild(GAME.ui.keys);
	GAME.ui.keyCount = 0;
}

function updateUI () {
	GAME.ui.lives.text = GAME.currentMap.lives;
	GAME.ui.keys.text = GAME.ui.keyCount;
	GAME.ui.minorCollectableCount.text = GAME.ui.totalMinorCollectables - GAME.currentMap.minorCollectables.length;
	GAME.ui.mainCollectableFound.text = GAME.currentMap.mainCollectable ? '' : 'COMPLETE';
}