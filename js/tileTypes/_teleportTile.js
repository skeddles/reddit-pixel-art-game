new TileType('teleporters', {
	uiInit: ()=> {
		
		
	},
	uiUpdate: ()=> {
		
	},
	onLoad: (object)=>{
		console.log("teleporter loaded jim", object);
		let sprite = PIXI.Sprite.from('images/teleporters.png');
		sprite.x = TILESIZE * object.x;
		sprite.y = TILESIZE * object.y;
		GAME.level.addChild(sprite);
		return sprite;

	}
});


new CollisionType('teleporters', 'circle', function (keyCollission) {
	
});
