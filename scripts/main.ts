import { initializeGame, Runner, Bot } from './Game';
import { Random } from './Utils';

let runner: Runner;
const options = {
	animationSpeed: 1,
	focusOnPlayerIndex: -1,
	renderGrid: true,
};

const inputSeedElement = (document.getElementById('seed-input') as HTMLInputElement);
const startStopButtonElement = (document.getElementById('start-stop-button') as HTMLButtonElement);
const pauseResumeButtonElement = (document.getElementById('pause-resume-button') as HTMLButtonElement);
const renderGridCheckboxElement = (document.getElementById('render-grid-checkbox') as HTMLInputElement);
const animationSpeedSliderElement = (document.getElementById('animation-speed-slider') as HTMLInputElement);
const animationSpeedValueElement = (document.getElementById('animation-speed-value') as HTMLInputElement);
const focusPlayerElement = (document.getElementById('focus-player-dropdown') as HTMLInputElement);

// NOTE: Initialize option values
renderGridCheckboxElement.checked = options.renderGrid;
animationSpeedSliderElement.value = options.animationSpeed.toString();
animationSpeedValueElement.innerText = options.animationSpeed.toString();
focusPlayerElement.value = options.focusOnPlayerIndex.toString();

pauseResumeButtonElement.onclick = pauseResumeButtonClick;
startStopButtonElement.onclick = startStopButtonClick;
renderGridCheckboxElement.onchange = renderGridChanged;
animationSpeedSliderElement.onchange = animationSpeedChanged;
focusPlayerElement.onchange = focusPlayerChange;

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

function renderGridChanged() {
	options.renderGrid = renderGridCheckboxElement.checked;
}

function animationSpeedChanged() {
	options.animationSpeed = +animationSpeedSliderElement.value;
	animationSpeedValueElement.innerText = animationSpeedSliderElement.value;
}

function focusPlayerChange() {
	options.focusOnPlayerIndex = +focusPlayerElement.value;
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

	const playerSelectOptions = playerControllers.map((c, i) => `<option value="${i}">${c.constructor.name}</option>`);
	console.log(playerSelectOptions);
	focusPlayerElement.innerHTML = "<option value='-1'>ALL</option>" + playerSelectOptions.join();

	runner = initializeGame(randomizer, 15, playerControllers, 20, 20);
	runner.run(options);
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
