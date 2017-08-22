import Game from './Game';
import { LuigiBot, PushBot, PullBot, ChickenBot, RandomBot, ShoveBot } from './PremadeBots'

var game;
var seed;

function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

var main = function() {
	document.getElementById("startButton").onclick = startGame;
};

var startGame = function() {
	if(window['running']) {
		console.log("Game is already running, but was told to run again.");
	} else {
		window['running'] = true;
		seed = 12345;
	
		var playerControllers = [
			new LuigiBot(seed), 
			new PushBot(seed), 
			new PullBot(seed), 
			new ChickenBot(seed), 
			new RandomBot(seed), 
			new ShoveBot(seed)
		];
	
		game = new Game(seed, 15, playerControllers, 50, 50);
		game.start();
	}
};

main();