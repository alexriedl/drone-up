import { initializeGame, Runner, Bot } from './Game';
import { Random } from './Utils';

let runner: Runner;

const inputSeedElement = (document.getElementById('seedInput') as HTMLInputElement);
const startStopButtonElement = (document.getElementById('startStopButton') as HTMLButtonElement);
const pauseResumeButtonElement = (document.getElementById('pauseResumeButton') as HTMLButtonElement);

pauseResumeButtonElement.onclick = () => pauseResumeButtonClick();
startStopButtonElement.onclick = () => startStopButtonClick();

function pauseResumeButtonClick(): void {
	if (!runner || !runner.isStarted()) return;

	if (runner.isPaused()) resumeGame();
	else pauseGame();
}

function startStopButtonClick(): void {
	if (runner && runner.isStarted()) stopGame();
	else startGame();
}

function getRandomSeed(): number {
	return new Date().getTime();
}

function stopGame(): void {
	inputSeedElement.disabled = false;
	startStopButtonElement.innerHTML = 'Start Game';
	pauseResumeButtonElement.disabled = true;
	pauseResumeButtonElement.innerHTML = 'Pause Game';

	runner.kill();
	runner = null;
}

function startGame(): void {
	inputSeedElement.disabled = true;
	pauseResumeButtonElement.disabled = false;
	pauseResumeButtonElement.innerHTML = 'Pause Game';
	startStopButtonElement.innerHTML = 'End Game';

	let inputSeed = inputSeedElement.value;
	if (!inputSeed || inputSeed.length <= 0) {
		inputSeed = getRandomSeed().toString();
	}

	const seed = +inputSeed > 0 ? +inputSeed : getRandomSeed();
	inputSeedElement.value = seed.toString();

	const randomizer = new Random(seed);
	const playerControllers = [
		new Bot.Luigi(randomizer),
		new Bot.Push(randomizer),
		new Bot.Pull(randomizer),
		new Bot.Chicken(randomizer),
		new Bot.Random(randomizer),
		new Bot.Shove(randomizer),
	];

	runner = initializeGame(randomizer, 15, playerControllers, 30, 20);
	runner.run();
}

function pauseGame(): void {
	pauseResumeButtonElement.innerHTML = 'Resume Game';
	runner.pause();
}

function resumeGame(): void {
	pauseResumeButtonElement.innerHTML = 'Pause Game';
	runner.resume();
}

// Allow Hot Module Reloading
declare var module: any;
if (module.hot) {
	module.hot.accept();
}
