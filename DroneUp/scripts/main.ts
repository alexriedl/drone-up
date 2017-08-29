import Random from './Random';
import Game from './Game';
import { LuigiBot, PushBot, PullBot, ChickenBot, RandomBot, ShoveBot } from './Bots/PremadeBots'

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
		if (inputSeed.length > 0) {
			seed = +inputSeed;
		} else {
			inputSeed = getRandomSeed().toString();
			inputSeedElement.value = inputSeed;
		}

		seed = +inputSeed > 0 ? +inputSeed : getRandomSeed();

		const randomizer = new Random(seed);

		const playerControllers = [
			new LuigiBot(randomizer),
			new PushBot(randomizer),
			new PullBot(randomizer),
			new ChickenBot(randomizer),
			new RandomBot(randomizer),
			new ShoveBot(randomizer)
		];

		game = new Game(seed, 15, playerControllers, 50, 50);
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
