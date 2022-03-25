
class CollisionType {
	constructor (objectHolderName, collisionType, onCollision) {
		this.objectHolderName = objectHolderName;
		this.checkForCollision = CheckCollision[collisionType];
		this.onCollision = onCollision;

		GAME.CollisionTypes.push(this);
	}

	//main function called by gameloop each frame 
	check () {		//console.log('check', this.objectHolderName)
		//get list of objects that we should check
		let objectsToCheck;
		if (!GAME.currentMap[this.objectHolderName]) 					objectsToCheck = [];
		else if (Array.isArray(GAME.currentMap[this.objectHolderName])) objectsToCheck = GAME.currentMap[this.objectHolderName];
		else 															objectsToCheck = [GAME.currentMap[this.objectHolderName]];

		//loop through all of the objectsToCheck and see if any have a collission
		let collision = objectsToCheck.find(this.checkForCollision.bind(this));
		if (collision) {
			this.onCollision(collision);
			return true;
		}
	}
}

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

	let playerCollision = {
		x: x+TILESIZE/2, 
		y: y+TILESIZE/2, 
		radius: (TILESIZE-2)/2
	}

	//loop through every wall on the map and check if the player would hit it
	for (let i = 0; i<GAME.currentMap.walls.length;i++) {
		let wall = GAME.currentMap.walls[i];

		//check if this wall overlaps player
		if (circleRectCollission(playerCollision, {	
				left: wall.x,
				top: wall.y,
				right: wall.x+TILESIZE,
				bottom: wall.y+TILESIZE,
			})) 
			return false;
	}


	//loop through every door on the map and check if the player would hit it
	if (GAME.ui.keyCount < 1) {
		for (let i = 0; i<GAME.currentMap.doors.length;i++) {
			let door = GAME.currentMap.doors[i];

			//check if this wall overlaps player
			if (circleRectCollission(playerCollision, {	
					left: door.x,
					top: door.y,
					right: door.x+TILESIZE,
					bottom: door.y+TILESIZE,
				})) 
				return false;
		}
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









