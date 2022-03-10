


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
		return alert("map files must be png type");
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

	let blockCount = {blue: 0};

	//check 
	getImagePixels(mapDataImg).eachPixel((x,y,color,r,g,b,a) => {
		console.log('pixel', x,y, color) ;

		if (!color) console.warn('MAP DATA VALIDATION ISSUE: invalid color found at X'+x+'-Y'+y+' : R'+r+'-G'+g+'-B'+b+'-A'+a);

		if (!blockCount[color]) blockCount[color] = 0;
		blockCount[color]++;		
	});

	console.log('final blockcount', blockCount);

	//validate results of map
	if (blockCount.undefined) return 'invalid colors found in piece';
	if (blockCount.white == 0) return 'no walkable tiles found (white)';
	if (blockCount.magenta == 0) return 'no starting point found (magenta)';
	if (blockCount.magenta > 1) return 'too many starting points (magenta) defined (you have '+blockCount.magenta+', should be 1)';
	if (blockCount.yellow > 1) return 'too many main collectables (yellow) defined (you have '+blockCount.yellow+', should be 1)';

	//warnings (doesnt reject map but they might want to fix)
	if (blockCount.yellow < 1) console.warn('MAP DATA VALIDATION ISSUE: no generic collectables (yellow) found');
	
	//show next loading step
	nextLoadingStep(3);

	//success
	return true;

}

//creates the json that can be downloaded, and will be used by the final game to load levels
function createMapJSON () {
	let levelData = {
		title: $('.mapEditor .level-name').value,
		author: $('.mapEditor .author-username').value,
		startingLocation: null,
		mainCollectable: null,
		walls: [],
		killTiles: [],
		minorCollectables: [],
		keys: [],
		doors: [],
		backgroundImage: $('.mapEditor .mapPreview').src
	};

	//analyse map data image
	getImagePixels($(".mapDataPreview")).eachPixel((x,y,color) => {
		
		if (color == 'magenta') return levelData.startingLocation = {x:x,y:y};
		if (color == 'yellow') return levelData.mainCollectable = {x:x,y:y};

		if (color == 'black') return levelData.walls.push({x:x,y:y});
		if (color == 'red') return levelData.killTiles.push({x:x,y:y});
		if (color == 'green') return levelData.minorCollectables.push({x:x,y:y});

		if (color == 'cyan') return levelData.keys.push({x:x,y:y});
		if (color == 'blue') return levelData.doors.push({x:x,y:y});
	});

	//success
	return levelData;
}

//final load map button
$(".mapEditor .test-level").onclick = () => {
	
	//create json and load it as a map
	loadMap(createMapJSON());
	
	//hide the map editor popup
	$(".mapEditor").classList.remove('visible');
}

//final load map button
$(".mapEditor .download-level").onclick = () => {

	let mapJsonData = createMapJSON();
	let fileName = mapJsonData.title.toLowerCase().replace(/\s/gi,'-') + '-reddit-game-level';

	downloadObjectAsJson(mapJsonData,fileName);
}

//close button - hides the map editor popup
$(".mapEditor button.close").onclick = () => {
	$(".mapEditor").classList.remove('visible');
}

//open level editor when user clicks button
$(".level-editor").onclick = () => {
	$(".mapEditor").classList.add('visible');
}


//open level editor if url has ?showLevelEditor=true
if (URLPARAMS.get('showLevelEditor')) $(".mapEditor").classList.add('visible');


//open file button
$(".load-level").onclick = () => {
	$(".file-loader").click();
}
$(".file-loader").addEventListener('change', e=> {
	console.log('loaded', e)

	const reader = new FileReader();
	reader.onload = function (d) {
		console.log('loadddd',reader.result)
		var fileContent = JSON.parse(reader.result);

		loadMap(fileContent);
	};

	reader.readAsText($(".file-loader").files[0]);
});