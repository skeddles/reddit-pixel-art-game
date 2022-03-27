new TileType('entrance', [255,0,255], {
	required: true,
	maxNumberAllowed: 1,
	onLoad: e => ({
		x: e.x * TILESIZE,
		y: e.y * TILESIZE,
	}),
});