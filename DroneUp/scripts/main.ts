import Game from './Game';
import { LuigiBot, PushBot, PullBot, ChickenBot, RandomBot, ShoveBot } from './PremadeBots'

var game;
var seed;

var main = function () {
  document.getElementById("pauseResumeButton").onclick = () => pauseResumeButtonClick();
  document.getElementById("startStopButton").onclick = () => startStopButtonClick();
};

var pauseResumeButtonClick = function() {
	if (game && game.started && !game.paused) {
		console.log("Pausing game");
		pauseGame();
	} else {
		console.log("Resuming game");
		resumeGame();
	}
};

var startStopButtonClick = function() {
	if (game && game.started) {
		console.log("Terminating game");
		stopGame();
	} else {
		console.log("Starting game");
		startGame();
	}
};

var getRandomSeed = function() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "/api/mapseed", false);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send();
	var randomSeed = JSON.parse(xhttp.responseText);

	return randomSeed;
};

var stopGame = function() {
	var inputSeedElement = (document.getElementById("seedInput") as HTMLInputElement);
	var startStopButtonElement = (document.getElementById("startStopButton") as HTMLButtonElement);
	var pauseResumeButtonElement = (document.getElementById("pauseResumeButton") as HTMLButtonElement);

	inputSeedElement.disabled = false;
	startStopButtonElement.innerHTML = "Start Game"; 
	pauseResumeButtonElement.disabled = true;
	pauseResumeButtonElement.innerHTML = "Pause Game";

	game.kill();
};

var startGame = function() {
		var inputSeedElement = (document.getElementById("seedInput") as HTMLInputElement);
		var startStopButtonElement = (document.getElementById("startStopButton") as HTMLButtonElement);
		var pauseResumeButtonElement = (document.getElementById("pauseResumeButton") as HTMLButtonElement);

		inputSeedElement.disabled = true;
		pauseResumeButtonElement.disabled = false;
		pauseResumeButtonElement.innerHTML = "Pause Game";
		startStopButtonElement.innerHTML = "End Game";

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
};

var pauseGame = function() {
	var pauseResumeButtonElement = (document.getElementById("pauseResumeButton") as HTMLButtonElement);

	pauseResumeButtonElement.innerHTML = "Resume Game";

	game.pause();
};
var resumeGame = function() {
	var pauseResumeButtonElement = (document.getElementById("pauseResumeButton") as HTMLButtonElement);

	pauseResumeButtonElement.innerHTML = "Pause Game";

	game.resume();
};

main();
