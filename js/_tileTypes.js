GAME.tileTypes = [];

/*
A TileType should be created for each tile that needs to be generated, each should correspond to a specific color on the data map.
If you tile needs collisions, make sure to also define a CollisionType.

new TileType(NAME, COLORS, OPTIONS);

[NAME]			should be a string in camel case
[COLOR]			should be an array of 3 values, a red green and blue (which determinds what color to look for on the data map)
[OPTIONS]	
	[required]	set to true if every map must have at least one of these tiles
	[minNumberAllowed]	a number which indicates the minimum number of these tiles allowed per map (only triggered if required, or at least one is present)
	[maxNumberAllowed]	a number which indicates the total number of these tiles allowed per map
	[onLoad]	this is run on EACH instance of this tile when the level is loaded. the first argument contains the coordinates as an object, and it must return an object. if not specified, it will use defaultTileLoader to spawn a single static sprite on each of those tiles.
	[uiInit]	this is run once when the game is loaded, used for adding elements to the UI screen
	[uiUpdate]	this is run every frame, used for updated values on UI elements
*/

class TileType {
	constructor (tileName, color, options) {
		this.name = tileName;
		this.color = this.validateColor(color);
		this.onLoad = options.onLoad || this.defaultTileLoader;
		this.uiInit = options.uiInit || (()=>{});
		this.uiUpdate = options.uiUpdate || (()=>{});
		this.required = options.required || false;
		this.minNumberAllowed = options.minNumberAllowed || 0;
		this.maxNumberAllowed = options.maxNumberAllowed || 5000;

		GAME.tileTypes.push(this);
	}

	load () {
		console.log('loading tiles:', this.name, this);
		//process each object in the array of this tile with the onload function
		try {
			GAME.currentMap[this.name] = GAME.currentMap[this.name].map(this.onLoad.bind(this));
		} 
		catch (err) {return console.error('failed to load tile',this.name,err);}

		this.uiInit();
	}

	defaultTileLoader (object) {
		console.log('default loader',this.name)
		//let sprite = PIXI.Sprite.from('images/'+this.name+'.png');
		let sprite = new PIXI.Sprite(GAME.currentMap.spritesheet.textures[this.name]);
		sprite.x = TILESIZE * object.x;
		sprite.y = TILESIZE * object.y;
		GAME.level.addChild(sprite);
		return sprite;
	}

	//just makes sure the colors people put in are the right format
	validateColor (color) {
		let errorMessage = 'INVALID COLOR DEFINED! The color you picked for "'+ this.name+'" tiles was invalid. Make sure it\'s an array of 3 numbers from 0-255. ERROR: ';
		if (!Array.isArray(color)) console.error(errorMessage, 'not an array');
		if (color.length !== 3) console.error(errorMessage, 'array length not 3');
		if (isNaN(color[0])) console.error(errorMessage,'red is not a number');
		if (isNaN(color[1])) console.error(errorMessage,'green is not a number');
		if (isNaN(color[2])) console.error(errorMessage,'blue is not a number');
		if (color[0]<0) console.error(errorMessage,'red less than 0');
		if (color[1]<0) console.error(errorMessage,'green less than 0');
		if (color[2]<0) console.error(errorMessage,'blue less than 0');
		if (color[0]>255) console.error(errorMessage,'red greater than 255');
		if (color[1]>255) console.error(errorMessage,'green greater than 255');
		if (color[2]>255) console.error(errorMessage,'blue greater than 255');
		return color;
	}
}
