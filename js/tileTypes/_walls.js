new TileType('walls', [0,0,0], {
	onLoad: e => ({
		x: e.x * TILESIZE,
		y: e.y * TILESIZE,
	}),
});