GAME.tileTypes = [];

class TileType {
	constructor (tileName, options) {
		this.name = tileName;
		this.onLoad = options.onLoad || this.defaultTileLoader;
		this.uiInit = options.uiInit || (()=>{});
		this.uiUpdate = options.uiUpdate || (()=>{});

		GAME.tileTypes.push(this);
	}

	load () {
		console.log('loading tiles:', this.name, this);
		//process each object in the array of this tile with the onload function
		GAME.currentMap[this.name] = GAME.currentMap[this.name].map(this.onLoad.bind(this));

		this.uiInit();
	}

	defaultTileLoader (object) {
		console.log('default loader',this.name)
		let sprite = PIXI.Sprite.from('images/'+this.name+'.png');
		sprite.x = TILESIZE * object.x;
		sprite.y = TILESIZE * object.y;
		GAME.level.addChild(sprite);
		return sprite;
	}
}
