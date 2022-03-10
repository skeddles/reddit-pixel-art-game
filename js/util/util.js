const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function degreesToRadians(degrees) {return degrees * (Math.PI / 180);}

//random
random = Math.random;
smaller = Math.min;
bigger = Math.max;
round = Math.round;
floor = Math.floor;
ceil = Math.ceil;
pow = Math.pow;
clamp = (num, min, max) => Math.min(Math.max(num, min), max);
lerp = (start, end, amount) => (1-amount)*start + amount*end;

//a random integer up to the max
function irandom(maxInt) {return Math.round(Math.random() * maxInt);}
//a random boolean (coin flip)
function birandom(maxInt) {return Math.random() > 0.5}
//return a random item from an array
function arandom(items) {return items[Math.floor(Math.random()*items.length)];}

// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
function deepMergeObjects(target, source) {

	console.warn('deepMergeObjects tar',target, JSON.stringify(target))
	console.warn('deepMergeObjects stc',source, JSON.stringify(source))
	target = JSON.parse(JSON.stringify(target));
	source = JSON.parse(JSON.stringify(source));

	// Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
	for (const key of Object.keys(source)) {
		if (source[key] instanceof Object)
			Object.assign(source[key], deepMergeObjects(target[key], source[key]));
	}

	// Join `target` and modified `source`
	Object.assign(target || {}, source);
	return target;
}
