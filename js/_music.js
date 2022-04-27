

const MUSIC = {
	CURRENT: false
};


function playSong(name) {

	//stop currently playing song 
	if (MUSIC.CURRENT) {
		console.log('stopping', MUSIC.CURRENT)
		MUSIC.CURRENT.pause();
		MUSIC.CURRENT.currentTime = 0; 
	}

	//load song if not yet loaded
	if (!MUSIC[name]) {
		console.info('loading song',name);

		let el = document.createElement("audio");
			el.src = 'music/'+name+'.mp3';
			el.setAttribute("preload", "auto");
			el.setAttribute("controls", "none");
			el.style.display = "none";
			document.body.appendChild(el);
			el.loop = true;
		MUSIC[name] = el;
	}

	MUSIC[name].currentTime = 0; 
	MUSIC[name].play();
	MUSIC.CURRENT = MUSIC[name]
}