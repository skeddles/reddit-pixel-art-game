
const INPUT = {
	
}

document.addEventListener('keydown', e=> {
	INPUT[e.code] = true;
});

document.addEventListener('keyup', e=> {
	INPUT[e.code] = false;
});