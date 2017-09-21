import { Controller } from './Bot';
import { Drone } from './GameObject';
import { Random, Color } from '../Utils';
import { SimpleRectangle } from '../Model';
import Map from './Map';
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

function getNextPlayerColor(randomizer: Random, options: Color[]): Color {
	if (options && options.length > 0) {
		return options.pop();
	}
	else {
		const r = () => randomizer.nextRangeFloat(0.3, 1);
		return new Color(r(), r(), r());
	}
}

export function initializeGame(randomizer: Random, spikePercent: number, playerControllers: Controller[],
	xSize: number, ySize: number): Runner {
	const spikeColor = new Color(.6, .6, .6);
	const playerColors = [...predefinedColors];
	const createDroneModel = () => new SimpleRectangle(getNextPlayerColor(randomizer, playerColors));
	const createSpikeModel = () => new SimpleRectangle(spikeColor);

	const drones = [];
	for (const controller of playerControllers) {
		drones.push(new Drone(createDroneModel(), controller));
	}

	const map = new Map(xSize, ySize);
	map.initialize(randomizer, drones, spikePercent, createSpikeModel);

	return new Runner(map);
}
