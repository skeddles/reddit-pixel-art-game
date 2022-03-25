new TileType('mainCollectable', {
	uiInit: ()=>{
		//main collectable text
		GAME.ui.mainCollectableFound = new PIXI.Text('',{fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'right'});
		GAME.ui.mainCollectableFound.x = (GAME.app.renderer.width / GAME.app.stage.scale.x) / 2 ;
		GAME.ui.mainCollectableFound.y = (GAME.app.renderer.height / GAME.app.stage.scale.y);
		GAME.ui.mainCollectableFound.anchor.set(0.5,1);
		GAME.ui.addChild(GAME.ui.mainCollectableFound);
	},
	uiUpdate: ()=> {
		GAME.ui.mainCollectableFound.text = GAME.currentMap.mainCollectable.length>0 ? '' : 'COMPLETE';
	}
});

new CollisionType('mainCollectable', 'rect', 
	function () {
		GAME.level.removeChild(GAME.currentMap.mainCollectable[0]);
		zzfx(...[,,730,,.06,.18,1,.23,,9.8,-158,.04,,,,,,.63,.05]);
		GAME.currentMap.mainCollectable.length = 0;
	}
);
