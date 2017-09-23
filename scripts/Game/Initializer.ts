import { Controller } from './Bot';
import { Drone, Spike } from './GameObject';
import { Random, Color, MarkList } from '../Utils';
import { SimpleRectangle } from '../Model';
import { vec2, vec3 } from '../Math';
import Runner from './Runner';

const predefinedColors: Color[] = [
	// new Color(0, 0, 0),
	new Color(0, 0, 1),
	new Color(0, 1, 0),
	new Color(0, 1, 1),
	new Color(1, 0, 0),
	new Color(1, 0, 1),
	new Color(1, 1, 0),
	// new Color(1, 1, 1),
];

export function initializeGame(randomizer: Random, spikePercent: number, playerControllers: Controller[],
	xSize: number, ySize: number): Runner {

	// TODO: Support board sizes with odd height/width
	if (xSize % 2 !== 0) xSize += 1;
	if (ySize % 2 !== 0) ySize += 1;

	const markedList = new MarkList(xSize, ySize);
	const players = generatePlayers(randomizer, playerControllers, markedList);
	const spikes = generateSpikes(randomizer, spikePercent, markedList);

	return new Runner(players, spikes, new vec2(xSize, ySize));
}

function generatePlayers(randomizer: Random, controllers: Controller[], markedList: MarkList): Drone[] {
	const playerColors = [...predefinedColors];
	const createDroneModel = () => new SimpleRectangle(getNextPlayerColor(randomizer, playerColors));

	return controllers.map((controller) => {
		const position = randomSafePosition(randomizer, markedList, 3);
		if (position) return new Drone(createDroneModel(), controller, position);
	});
}

function generateSpikes(randomizer: Random, spikePercent: number, markedList: MarkList): Spike[] {
	const spikeArray: Spike[] = [];
	const neededSpikes = (markedList.xSize * markedList.ySize * spikePercent) / 100;

	const spikeColor = new Color(.6, .6, .6);
	const createSpikeModel = () => new SimpleRectangle(spikeColor);

	for (let i = 0; i < neededSpikes; i++) {
		const position = randomSafePosition(randomizer, markedList, 0);
		if (position) spikeArray.push(new Spike(createSpikeModel(), position));
	}

	return spikeArray;
}

function randomSafePosition(randomizer: Random, markedList: MarkList, range: number): vec3 {
	let attempts = 0;
	let position;
	while (!position) {
		if (attempts > 1000) {
			alert('Could not find a safe place to place object after 1000 attempts, aborting...');
			return null;
		}

		position = randomPosition(randomizer, markedList.xSize, markedList.ySize);
		const invalidPosition = markedList.isMarked(position);

		if (invalidPosition) {
			position = undefined;
			attempts++;
		}
		else {
			markedList.mark(position, range);
			return position;
		}
	}
}

function randomPosition(randomzier: Random, maxX: number, maxY: number): vec3 {
	const x = randomzier.nextRangeInt(0, maxX);
	const y = randomzier.nextRangeInt(0, maxY);
	return new vec3(x, y);
}

function getNextPlayerColor(randomizer: Random, options: Color[]): Color {
	if (options && options.length > 0) {
		return options.pop();
	}
	else {
		const r = () => randomizer.nextRangeFloat(0.3, 1);
		return new Color(r(), r(), r());
	}
}
