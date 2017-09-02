import { LuigiBot, PushBot, PullBot, ChickenBot, RandomBot, ShoveBot } from './Bots/PremadeBots'
import { Random } from './Utils';
import Game from './Game';

let game: Game;
let seed: number;

const inputSeedElement = (document.getElementById("seedInput") as HTMLInputElement);
const startStopButtonElement = (document.getElementById("startStopButton") as HTMLButtonElement);
const pauseResumeButtonElement = (document.getElementById("pauseResumeButton") as HTMLButtonElement);

pauseResumeButtonElement.onclick = () => pauseResumeButtonClick();
startStopButtonElement.onclick = () => startStopButtonClick();

function pauseResumeButtonClick(): void {
	if (game && game.isStarted() && !game.isPaused()) {
		console.log("Pausing game");
		pauseGame();
	} else {
		console.log("Resuming game");
		resumeGame();
	}
}

function startStopButtonClick(): void {
	if (game && game.isStarted()) {
		console.log("Terminating game");
		stopGame();
	} else {
		console.log("Starting game");
		startGame();
	}
}

function getRandomSeed(): number {
	return new Date().getTime();
}

function stopGame(): void {
	inputSeedElement.disabled = false;
	startStopButtonElement.innerHTML = "Start Game";
	pauseResumeButtonElement.disabled = true;
	pauseResumeButtonElement.innerHTML = "Pause Game";

	game.kill();
}

function startGame(): void {
	inputSeedElement.disabled = true;
	pauseResumeButtonElement.disabled = false;
	pauseResumeButtonElement.innerHTML = "Pause Game";
	startStopButtonElement.innerHTML = "End Game";

	var inputSeed = inputSeedElement.value;
	if (!inputSeed || inputSeed.length <= 0) {
		inputSeed = getRandomSeed().toString();
	}

	seed = +inputSeed > 0 ? +inputSeed : getRandomSeed();
	inputSeedElement.value = seed.toString();

	const randomizer = new Random(seed);
	const playerControllers = [
		new LuigiBot(randomizer),
		new PushBot(randomizer),
		new PullBot(randomizer),
		new ChickenBot(randomizer),
		new RandomBot(randomizer),
		new ShoveBot(randomizer)
	];

	game = new Game(randomizer, 15, playerControllers, 20, 20);
	// game = new Game(randomizer, 15, playerControllers, 50, 50);
	game.start();
}

function pauseGame(): void {
	pauseResumeButtonElement.innerHTML = "Resume Game";
	game.pause();
}

function resumeGame(): void {
	pauseResumeButtonElement.innerHTML = "Pause Game";
	game.resume();
}

// Allow Hot Module Reloading
declare var module: any;
if (module.hot) {
	module.hot.accept();
}
