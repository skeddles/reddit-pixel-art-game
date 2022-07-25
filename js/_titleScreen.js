//page is loaded
window.addEventListener('load', e=>{
	GAME.titleScreen = new PIXI.Container();
	GAME.app.stage.addChild(GAME.titleScreen);

	let bottomOfScreen = (GAME.app.renderer.height / GAME.app.stage.scale.y);

	let bg = PIXI.Sprite.from('images/intro-bg.png');
		bg.anchor.set(0.5, 1); // makes the bottom the anchor point
		bg.x = (GAME.app.renderer.width / GAME.app.stage.scale.x / 2); //pushes it down the entire width of the screen (so it's bottom is aligned to bottom of screen)
		bg.y = bottomOfScreen; //pushes it down the entire width of the screen (so it's bottom is aligned to bottom of screen)
		GAME.titleScreen.addChild(bg);

	let text = new PIXI.Text('COLLECTIVE WORK\n\n\nclick to start', {fontFamily :"Press Start 2P", fontSize: 8, fill : 0xffffff, align : 'center', wordWrap: true, wordWrapWidth: 125});
		text.scale.set(0.75);
		text.x = (GAME.app.renderer.width / GAME.app.stage.scale.x) / 2 ;
		text.y = bottomOfScreen / 2;
		text.scale.set(1.25);
		text.anchor.set(0.5, 0.5);
		GAME.titleScreen.addChild(text);
		GAME.titleText = text;
});	


//when clicked, start the game
window.addEventListener('click', startGame);