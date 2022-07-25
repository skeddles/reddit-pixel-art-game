
const INPUT = {
	
}

document.addEventListener('keydown', e=> {
	console.log('e',e.code)
	INPUT[e.code] = true;

	//arrow keys
	if (e.code=='ArrowUp') INPUT['KeyW'] = true;
	if (e.code=='ArrowDown') INPUT['KeyS'] = true;
	if (e.code=='ArrowLeft') INPUT['KeyA'] = true;
	if (e.code=='ArrowRight') INPUT['KeyD'] = true;

	if (!$("body").classList.contains('mapEditorVisible'))
		e.preventDefault();
});

document.addEventListener('keyup', e=> {
	INPUT[e.code] = false;

	//arrow keys
	if (e.code=='ArrowUp') INPUT['KeyW'] = false;
	if (e.code=='ArrowDown') INPUT['KeyS'] = false;
	if (e.code=='ArrowLeft') INPUT['KeyA'] = false;
	if (e.code=='ArrowRight') INPUT['KeyD'] = false;
	
	if (!$("body").classList.contains('mapEditorVisible'))
		e.preventDefault();
});

//when the window focus is lost, clear all inputs
document.addEventListener('blur', e=> {
	Object.keys(INPUT).forEach(k => INPUT[k] = false);
});
