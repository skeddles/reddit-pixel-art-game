
const INTRO_TEXT = 
`.\0\0\0\0\0.\0\0\0\0\0.\0\0\0\0\0\0


Hello?\0\0\0\0


Where am I? \0\0\0\0


What a strange place. I don't think we're in Reddit any more\0\0\0.\0\0\0.\0\0\0.\0\0\0\0


What are those weird lights on the ground?\0\0\0\0


Maybe they'll take me home\0\0\0.\0\0\0.\0\0\0.\0\0\0\0
`;

const OUTRO_TEXT = 
`
This must be the portal that will take me home!

Thank you so much for helping me!

It wasn't easy, but it was a little fun, no?

Perhaps we'll meet again some day!
\n\n\n
Bye!
`;


function loadCutscene (cutsceneText, portraitSprite, whenDone) {
	
	console.log('starting intro');
	GAME.inCutscene = true;
	GAME.ready = false;
	playSong('hubworld');

	GAME.intro = new PIXI.Container();
	GAME.app.stage.addChild(GAME.intro);


	let bottomOfScreen = (GAME.app.renderer.height / GAME.app.stage.scale.y);

	let bg = PIXI.Sprite.from('images/intro-bg.png');
		bg.anchor.set(0.5, 1); // makes the bottom the anchor point
		bg.x = (GAME.app.renderer.width / GAME.app.stage.scale.x / 2); //pushes it down the entire width of the screen (so it's bottom is aligned to bottom of screen)
		bg.y = bottomOfScreen; //pushes it down the entire width of the screen (so it's bottom is aligned to bottom of screen)
		GAME.intro.addChild(bg);


	let portrait = PIXI.Sprite.from('images/'+portraitSprite+'.png');
		portrait.x = 5;
		portrait.y = 10;
		GAME.intro.addChild(portrait);

	let text = new PIXI.Text('', {fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'left', wordWrap: true, wordWrapWidth: 125});
		text.scale.set(0.75);
		text.x = 60;
		text.y = bottomOfScreen - 20;
		GAME.intro.addChild(text);
		GAME.cutSceneText = text;
		console.log(text)

	let currentLetters = 0;
	let textLoop = setInterval(()=>{
		text.text=cutsceneText.substring(0, currentLetters);
		currentLetters++;

		//all letters have shown, start fading out
		if (currentLetters > cutsceneText.length + 10) 
			text.alpha -= 0.02;
		//end scene
		if (text.alpha <= 0) {
			clearInterval(textLoop);
			GAME.inCutscene = false;
			whenDone();
			return;
		}

		//play sound (one for periods, another for letters, skip the rest)
		if (cutsceneText.substring(currentLetters-1, currentLetters) == '.') 
			zzfx(...[,,1282,.01,.02,.01,4,2.55,-90,,,,,,,,,.46,.01]);
		else if (![' ', '\n', '.', '?', '\0', ''].includes(cutsceneText.substring(currentLetters-1, currentLetters)))
			zzfx(...[,,711,.01,,.01,1,.49,,,-70,.08,,.1,-0.8,,,1.1,.01]);
	}, 100);

}

function animateCutscene () {
	if (!GAME.inCutscene || !GAME.cutSceneText) return;

	GAME.cutSceneText.y -= 0.11;
}