
//returns true or false, whether the circle and rectangle are overlapping
function circleRectCollission (circle, rectangle) {
	// Find the closest point to the circle within the rectangle
	let closestX = clamp(circle.x, rectangle.left, rectangle.right);
	let closestY = clamp(circle.y, rectangle.top, rectangle.bottom);

	// Calculate the distance between the circle's center and this closest point
	let distanceX = circle.x - closestX;
	let distanceY = circle.y - closestY;

	// If the distance is less than the circle's radius, an intersection occurs
	let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
	return distanceSquared < (circle.radius * circle.radius);
}

//returns true or false, whether the two circles are overlapping
function circleCircleCollission (circleA, circleB) {
	let a = circleA.radius + circleB.radius;
	let x = circleA.x - circleB.x;
	let y = circleA.y - circleB.y;
  
	return (a > Math.sqrt((x * x) + (y * y)));
}

//checks if moving the player here would cause a collission
function isFree (x,y) {

	//make sure player is within room bounds
	if (x < 0) return false;
	if (y < 0) return false;
	if (x+TILESIZE > GAME.currentMap.bg.width) return false;
	if (y+TILESIZE > GAME.currentMap.bg.height) return false;

	//loop through every wall on the map and check if the player would hit it
	for (let i = 0; i<GAME.currentMap.walls.length;i++) {
		let wall = GAME.currentMap.walls[i];

		//check if this wall overlaps player
		if (circleRectCollission(
			//player
			{
				x: x+TILESIZE/2, 
				y: y+TILESIZE/2, 
				radius: (TILESIZE-2)/2
			},
			//wall
			{	
				left: wall.x*TILESIZE,
				top: wall.y*TILESIZE,
				right: wall.x*TILESIZE+TILESIZE,
				bottom: wall.y*TILESIZE+TILESIZE,
			})) 
			return false;
	}


	//success - space is free
	return true;
}

//checks if there's a wall at a specific tile space
function spaceHasWall(x,y) {
	//loop through walls
	return GAME.currentMap.walls.find(w => w.x == x && w.y == y)?true:false;
}

function updatePlayerCollision () {
	GAME.playerCollision = {
		x: GAME.player.x+TILESIZE/2, 
		y: GAME.player.y+TILESIZE/2, 
		radius: (TILESIZE-2)/2
	};
}

var CheckCollision = {
	'rect': (object) => {
		let player = GAME.playerCollision;
		let rectangle = {
			left: object.x,
			top: object.y,
			right: object.x+TILESIZE,
			bottom: object.y+TILESIZE,
		};

		// Find the closest point to the player within the rectangle
		let closestX = clamp(player.x, rectangle.left, rectangle.right);
		let closestY = clamp(player.y, rectangle.top, rectangle.bottom);

		// Calculate the distance between the player's center and this closest point
		let distanceX = player.x - closestX;
		let distanceY = player.y - closestY;

		// If the distance is less than the player's radius, an intersection occurs
		let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
		return distanceSquared < (player.radius * player.radius);
	},
	'circle': (object) => {
		let player = GAME.playerCollision;
		let circle = {
			x: object.x + TILESIZE/2, 
			y: object.y + TILESIZE/2, 
			radius: (TILESIZE-2)/2
		}
		let a = player.radius + circle.radius;
		let x = player.x - circle.x;
		let y = player.y - circle.y;
	  
		return (a > Math.sqrt((x * x) + (y * y)));
	},
}

class CollisionType {
	constructor (objectHolderName, collisionType, onCollision) {
		this.objectHolderName = objectHolderName;
		this.checkForCollision = CheckCollision[collisionType];
		this.onCollision = onCollision;

		GAME.CollisionTypes.push(this);
	}

	//main function called by checkForCollisions() each frame
	check () {
		//loop through all of the objectsToCheck and see if any have a collission
		let collision = this.objectsToCheck.find(this.checkForCollision.bind(this));
		if (collision) {
			this.onCollision(collision);
			return true;
		}
	}

	//uses the stored objectHolderName to retreive the array of objects from the current level (and if its not an array, wrap it in an array)
	get objectsToCheck () {
		if (!GAME.currentMap[this.objectHolderName]) return [];
		else if (Array.isArray(GAME.currentMap[this.objectHolderName])) return GAME.currentMap[this.objectHolderName];
		else return [GAME.currentMap[this.objectHolderName]];
	}

	//circular collission box for player, which most functions will use
	get playerCollision () {
			
		return {
			x: GAME.player.x+TILESIZE/2, 
			y: GAME.player.y+TILESIZE/2, 
			radius: (TILESIZE-2)/2
		};
	}
}

var mainCollectable = new CollisionType('mainCollectable', 'rect', 
	function () {
		GAME.app.stage.removeChild(GAME.currentMap.mainCollectable);
		zzfx(...[,,730,,.06,.18,1,.23,,9.8,-158,.04,,,,,,.63,.05]);
		delete GAME.currentMap.mainCollectable;
	}
);

var killTile = new CollisionType('killTiles', 'rect', 
	function () {

		//sound
		zzfx(...[1.09,,373,,.25,.42,4,2.97,.6,,,,.19,.7,-4.4,.7,,.42,.03]);

		GAME.player.x = TILESIZE * GAME.currentMap.startingLocation.x;
		GAME.player.y = TILESIZE * GAME.currentMap.startingLocation.y;
	}
);


var minorCollectable = new CollisionType('minorCollectables', 'circle', function (minorCollectableCollission) {
	//remove from stage
	GAME.app.stage.removeChild(minorCollectableCollission);
	//remove from array
	GAME.currentMap.minorCollectables =  GAME.currentMap.minorCollectables.filter(c => c !== minorCollectableCollission);
	//sound
	zzfx(...[1.02,,1596,.01,.04,,1,1.63,,,,,,,,,,.52,.03]);
});

