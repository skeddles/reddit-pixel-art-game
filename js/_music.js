

const MUSIC = {
	CURRENT: false
};


function playSong(name) {

	//if the song name is invalid, just play default instead
	if (!GAME.songList.includes(name)) name = 'default';

	stopMusic();

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

function stopMusic () {
	//stop currently playing song 
	if (MUSIC.CURRENT) {
		console.log('stopping', MUSIC.CURRENT)
		MUSIC.CURRENT.pause();
		MUSIC.CURRENT.currentTime = 0; 
	}
}

//get list of available songs
fetch('music-list.json')
	.then(response => response.json())
	.then(data => {
		GAME.songList = data;
		console.log('got song data', GAME.songList );

		GAME.songList.forEach(s => {
			if (s=='default'||s=='hubworld') return;
			$('.music-selection').insertAdjacentHTML('beforeend', '<option value="'+s+'">'+s+'</option>')
		})
		
	})
	.catch(error => console.log(error));
