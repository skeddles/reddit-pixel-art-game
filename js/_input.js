
const INPUT = {
	
}

document.addEventListener('keydown', e=> {
	INPUT[e.code] = true;
});

document.addEventListener('keyup', e=> {
	INPUT[e.code] = false;
});

//when the window focus is lost, clear all inputs
document.addEventListener('blur', e=> {
	Object.keys(INPUT).forEach(k => INPUT[k] = false);
});
