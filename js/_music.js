

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

		GAME.songList.forEach(songFileName => {
			if (songFileName=='default' || songFileName=='hubworld') return;
			let song = parseSongTitle(songFileName);
			$('.music-selection').insertAdjacentHTML('beforeend', '<option value="'+songFileName+'">'+song.clean+'</option>')
		})
		
	})
	.catch(error => console.log(error));

function parseSongTitle (songFileName) {
	let obj = {
		name: songFileName.match(/(^.*)-by-/)[1],
		author: '/u/' + songFileName.match(/-by-(.*$)/)[1],
	};

	obj.clean = obj.name +' by '+ obj.author;

	return obj;
}