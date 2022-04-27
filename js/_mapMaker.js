//keep track of which steps are visible to the user
var loadingStep = 1;
function nextLoadingStep (step) {
	if (step < loadingStep) return;
	else loadingStep++;

	//display proper step
	$(".mapEditor").dataset.step = 'step'+loadingStep;
}

//map image was selected
$(".loadMap").addEventListener("change", function (e) {
	const fileList = this.files;
	console.log("file selected", fileList);

	if (!fileList || !this.files || this.files.length < 1)
		return alert("there was a problem loading your file");
	let mapFile = this.files[0];
	if (!mapFile.type == "image/png")
		return alert("map files must be png type (got "+mapFile.type+')');

	console.log(mapFile);

	const reader = new FileReader();
	reader.onload = function () {
		$(".mapPreview").onload = ()=> {validateMap($(".mapPreview"));}
		$(".mapPreview").src = reader.result;
	};

	reader.readAsDataURL(mapFile);
});

function validateMap (mapImg) {
	console.log(
		'validating map image',{width:mapImg.width,height: mapImg.height, tilesize: TILESIZE, img: mapImg});

	if (mapImg.width % TILESIZE !== 0) return alert('map width must be divisible by '+TILESIZE);
	if (mapImg.height % TILESIZE !== 0) return alert('map height must be divisible by '+TILESIZE);

	console.log('map image is valid')
	nextLoadingStep(2);
	$('.step1-info').innerHTML = 'Resolution: '+mapImg.width+' x '+ mapImg.height + ' pixels.';
}

//map data image was selected
$(".loadMapData").addEventListener("change", function (e) {
	const fileList = this.files;
	console.log("file selected", fileList);

	if (!fileList || !this.files || this.files.length < 1)
		return alert("there was a problem loading your file");
	let mapDataFile = this.files[0];
	if (!mapDataFile.type == "image/png")
		return alert("map data files must be png type");
	console.log(mapDataFile);

	const reader = new FileReader();
	reader.onload = function () {
		$(".mapDataPreview").onload = ()=> {
			let validation = validateMapData($(".mapDataPreview"));

			//map data is invalid
			if (typeof validation == 'string') {
				alert('MAP DATA VALIDATION ERROR: '+validation);
				delete $(".mapDataPreview").src;
				return;
			}

			//map data is valid
			console.log('map data is valid');

			//scale up the map data overlay
			$(".mapDataPreview").style.width = $(".mapDataPreview").width * TILESIZE + 'px';
			//$(".mapDataPreview").style.height = $(".mapDataPreview").height * TILESIZE + 'px'; // this is not needed because images automatically keep their aspect ratio by default
		}
		$(".mapDataPreview").src = reader.result;
	};

	reader.readAsDataURL(mapDataFile);
});


function validateMapData (mapDataImg) {

	//validate dimentions
	let targetMapDataWidth = $(".mapPreview").width/TILESIZE;
	let targetMapDataHeight = $(".mapPreview").height/TILESIZE;

	if (mapDataImg.width !== targetMapDataWidth) return 'map data dimentions must be exactly '+targetMapDataWidth+'x'+targetMapDataHeight+' pixels';
	if (mapDataImg.height !== targetMapDataHeight) return 'map data dimentions must be exactly '+targetMapDataWidth+'x'+targetMapDataHeight+' pixels';

	let mapData = createMapJSON();
	for (var i=0; i<GAME.tileTypes.length; i++) {
		let tileType = GAME.tileTypes[i];
		let tileList = mapData[tileType.name];

		//no walkable tiles
		if (mapData.walkableTiles == 0) return 'map must include walkable tiles (white)';
		//invalid colors
		if (mapData.invalidTiles.length > 0) return 'map data included '+mapData.invalidTiles.length+' invalid colors. The first one is ['+mapData.invalidTiles[0].color.join(',')+'] at x'+mapData.invalidTiles[0].x+' y'+mapData.invalidTiles[0].y
		//require tile not found
		if (tileType.required && tileList.length < 1) return 'map must include '+tileType.name+' tile';
		//too many of tile
		if (tileList.length > tileType.maxNumberAllowed) return 'too many '+tileType.name+' tiles are defined. max: '+tileType.maxNumberAllowed;
		//not enough of require tile
		if (tileList.length < tileType.minNumberAllowed && tileType.required) return 'map must include '+tileType.minNumberAllowed+''+tileType.name+' tiles';
		//not enough of included tile
		if (tileList.length < tileType.minNumberAllowed && tileList.length > 0) return 'map must include '+tileType.minNumberAllowed+''+tileType.name+' tiles';
	}
	
	//show next loading step
	nextLoadingStep(3);

	//success
	return true;

}

//creates the json that can be downloaded, and will be used by the final game to load levels
function createMapJSON () {
	//grab info from form
	let levelData = {
		title: $('.mapEditor .level-name').value,
		author: $('.mapEditor .author-username').value,
		music: $('.music-selection').value,
		backgroundImage: $('.mapEditor .mapPreview').src,
		invalidTiles: [],
		walkableTiles: 0,
	};

	//optional images
	if ($('.objectSpriteSheetPreview').src) levelData.objectSpriteSheet = $('.objectSpriteSheetPreview').src;
	if ($('.playerSpriteSheetPreview').src) levelData.playerSpriteSheet = $('.playerSpriteSheetPreview').src;

	//initilize array for each tile type
	GAME.tileTypes.forEach(tt => levelData[tt.name] = []);

	//analyse map data image
	getImagePixels($(".mapDataPreview")).eachPixel((x,y,color) => {
		//skip white tiles
		if (color.join(',') == '255,255,255') return levelData.walkableTiles++;

		//check if theres a tile defined with the same color as this pixel
		let matchingTile = GAME.tileTypes.find(type=>type.color.join(',') === color.join(','))
		
		//if a tile was found, add this tile to its array
		if (matchingTile) return levelData[matchingTile.name].push({x:x,y:y});

		//failure - no color matched
		levelData.invalidTiles.push({x:x,y:y,color: color});
	});

	//success
	return levelData;
}


//object spritesheet image was selected
$(".loadObjectSpriteSheet").addEventListener("change", function (e) {
	const fileList = this.files;
	console.log("file selected", fileList);

	if (!fileList || !this.files || this.files.length < 1)
		return alert("there was a problem loading your file");
	let mapFile = this.files[0];
	if (!mapFile.type == "image/png")
		return alert("map files must be png type (got "+mapFile.type+')');

	console.log(mapFile);

	const reader = new FileReader();
	reader.onload = function () {
		let img = $(".objectSpriteSheetPreview")

		img.onload = ()=> {
			let validation;
			
			if (img.width !== 128) validation = 'width must be exactly 128px (got '+img.width+')';
			if (img.height !== 128) validation = 'height must be exactly 128px (got '+img.width+')';

			//validation failed
			if (validation) {
				alert('OBJECT SPRITE SHEET IS INVALID: '+validation);
				img.removeAttribute('src');
			}
		}
		img.src = reader.result;
	};

	reader.readAsDataURL(mapFile);
});

//player spritesheet image was selected
$(".loadPlayerSpriteSheet").addEventListener("change", function (e) {
	const fileList = this.files;
	console.log("file selected", fileList);

	if (!fileList || !this.files || this.files.length < 1)
		return alert("there was a problem loading your file");
	let mapFile = this.files[0];
	if (!mapFile.type == "image/png")
		return alert("map files must be png type (got "+mapFile.type+')');

	console.log(mapFile);

	const reader = new FileReader();
	reader.onload = function () {
		let img = $(".playerSpriteSheetPreview")

		img.onload = ()=> {
			let validation;
			
			if (img.width !== 48) validation = 'width must be exactly 48px (got '+img.width+')';
			if (img.height !== 160) validation = 'height must be exactly 160px (got '+img.width+')';

			//validation failed
			if (validation) {
				alert('PLAYER SPRITE SHEET IS INVALID: '+validation);
				img.removeAttribute('src');
			}
		}
		img.src = reader.result;
	};

	reader.readAsDataURL(mapFile);
});

//final load map button
$(".mapEditor .test-level").onclick = () => {
	
	clearOpenSaveGame();

	//create json and load it as a map
	loadMap('loadedLevel', createMapJSON());
	
	//hide the map editor popup
	hideLevelEditor();
}

//final load map button
$(".mapEditor .download-level").onclick = () => {

	let mapJsonData = createMapJSON();
	let fileName = mapJsonData.title.toLowerCase().replace(/\s/gi,'-') + '-reddit-game-level';

	downloadObjectAsJson(mapJsonData,fileName);
}

//close button - hides the map editor popup
$(".mapEditor button.close").onclick = () => {
	hideLevelEditor();
}

//open level editor when user clicks button
$(".level-editor").onclick = showLevelEditor;

function showLevelEditor () {
	$("body").classList.add('mapEditorVisible');

	//make sure the game doesn't run while the editor is open
	GAME.ready = false;

	//scroll to top of page
	window.scrollTo(0, 0);
}
function hideLevelEditor () {
	$("body").classList.remove('mapEditorVisible');

	//enable the game running again
	GAME.ready = true;

	//scroll to top of page
	window.scrollTo(0, 0);
}


//open level editor if url has ?showLevelEditor=true
if (URLPARAMS.get('showLevelEditor')) showLevelEditor();


//open file button
$(".load-level").onclick = () => {
	$(".file-loader").click();
}
$(".file-loader").addEventListener('change', e=> {
	console.log('loaded', e)

	clearOpenSaveGame();

	const reader = new FileReader();
	reader.onload = function (d) {
		console.log('loadddd',reader.result)
		var fileContent = JSON.parse(reader.result);

		loadMap('loadedLevel', fileContent);
	};

	reader.readAsText($(".file-loader").files[0]);
});

//test music button
$(".test-music").onclick = () => {
	playSong($('.music-selection').value);
}
//test music button
$(".stop-test-music").onclick = () => {
	stopMusic();
}