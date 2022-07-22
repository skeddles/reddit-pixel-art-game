



function loadCredits (whenDone) {
	
	//fetch the credits from the server
	fetch("credits.txt")
		.then((response) => response.text())
		.then((creditsText) => {

	console.log('starting intro');
	GAME.inCredits = true;
	GAME.ready = false;
	playSong('default');

	GAME.credits = new PIXI.Container();
	GAME.app.stage.addChild(GAME.credits);

	let middleOfScreen = (GAME.app.renderer.width / GAME.app.stage.scale.x);
	let bottomOfScreen = (GAME.app.renderer.height / GAME.app.stage.scale.y);
	let fontScale = 0.75;
	let fontBoxWidth = GAME.app.renderer.width / GAME.app.stage.scale.x / fontScale;

	let bg = PIXI.Sprite.from('images/intro-bg.png');
		bg.anchor.set(0.5, 1); // makes the bottom the anchor point
		bg.x = (GAME.app.renderer.width / GAME.app.stage.scale.x / 2); //pushes it down the entire width of the screen (so it's bottom is aligned to bottom of screen)
		bg.y = bottomOfScreen; //pushes it down the entire width of the screen (so it's bottom is aligned to bottom of screen)
		GAME.credits.addChild(bg);

	let text = new PIXI.Text(creditsText, {fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'center', wordWrap: true, wordWrapWidth: fontBoxWidth});
		text.scale.set(fontScale);
		text.x = middleOfScreen/2;
		text.y = bottomOfScreen;
		text.anchor.set(0.5,0);
		GAME.credits.addChild(text);
		GAME.creditText = text;

	}).catch((error) => console.log(error));
}

function animateCredits () {
	if (!GAME.inCredits || !GAME.creditText) return;

	GAME.creditText.y -= 0.11;

	let textIsOffscreen = 0 - GAME.creditText.getBounds().height / GAME.app.stage.scale.y;

	if (GAME.creditText.y < textIsOffscreen) {
		GAME.inCredits = false;
		GAME.ready = true;

		GAME.app.stage.removeChild(GAME.credits);

		//if the player truely got here from in game, send them back to hub
		if (GAME.saveData) loadHubWorld();
	}
}