
//used for reading the pixels of an image (like the map data image)
function getImagePixels (img) {
	console.log('hyelo',img)
	//create temporary canvas element
	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');

	//resize to match image
	canvas.width = img.width;
	canvas.height = img.height;

	//put image on canvas
	ctx.drawImage(img, 0, 0);

	//get pixels
	let pixels = ctx.getImageData(0, 0, img.width, img.height).data;

	//attach function for looping through all the pixels 
	pixels.eachPixel = function (callback) {
		console.log('getting pixels ')
		//loop through each pixel (which is made up of 4 values, so we skip 4 each time.)
		for (var i =0; i<this.length; i+=4) {
			let x = i/4%img.width;
			let y = floor(i/4/img.width);
			let r = this[i];
			let g = this[i+1];
			let b = this[i+2];
			let a = this[i+3];

			//transparent - dont call function
			if (a !== 255) continue;
			
			//return coordinates and color
			callback(x,y,[r,g,b]);
		}
	}

	return pixels;
}