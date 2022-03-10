
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
