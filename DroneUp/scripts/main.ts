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

var getRandomSeed = function() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "/api/mapseed", false);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send();
	var randomSeed = JSON.parse(xhttp.responseText);

	return randomSeed;
};

var startGame = function() {
	if(window['running']) {
		console.log("Game is already running, but was told to run again.");
	} else {
		var inputSeedElement = (document.getElementById("seedInput") as HTMLInputElement);
		inputSeedElement.disabled = true;
		window['running'] = true;

		var inputSeed = inputSeedElement.value;
		if (inputSeed.length > 0) {
			seed = inputSeed;
		} else {
			inputSeed = getRandomSeed();
			inputSeedElement.value = inputSeed;
		}

		seed = +inputSeed > 0 ? inputSeed : getRandomSeed;
	
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