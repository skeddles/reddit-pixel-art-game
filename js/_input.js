
const INPUT = {
	
}

document.addEventListener('keydown', e=> {
	INPUT[e.code] = true;

	if (!$("body").classList.contains('mapEditorVisible'))
		e.preventDefault();
});

document.addEventListener('keyup', e=> {
	INPUT[e.code] = false;
	
	if (!$("body").classList.contains('mapEditorVisible'))
		e.preventDefault();
});

//when the window focus is lost, clear all inputs
document.addEventListener('blur', e=> {
	Object.keys(INPUT).forEach(k => INPUT[k] = false);
});
