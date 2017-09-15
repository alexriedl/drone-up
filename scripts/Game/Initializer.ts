import { Controller } from './Bot';
import { Drone } from './GameObject';
import { DroneModel, SpikeModel } from '../Model';
import { Random, Color } from '../Utils';
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

function getNextPlayerColor(randomizer: Random): Color {
	if (predefinedColors && predefinedColors.length > 0) {
		return predefinedColors.pop();
	}
	else {
		const r = () => randomizer.nextRangeFloat(0.3, 1);
		return new Color(r(), r(), r());
	}
}

export function initializeGame(randomizer: Random, spikePercent: number, playerControllers: Controller[],
	xSize: number, ySize: number): Runner {
	const createDroneModel = (id: string) => new DroneModel(getNextPlayerColor(randomizer));
	const createSpikeModel = (id: string) => new SpikeModel();

	const drones = [];
	for (let i = 0; i < playerControllers.length; i++) {
		const controller = playerControllers[i];
		const ID = `player${i}`;
		drones.push(new Drone(ID, createDroneModel(ID), controller));
	}

	const map = new Map(xSize, ySize);
	map.initialize(randomizer, drones, spikePercent, createSpikeModel);

	const animationSpeed = 1;
	const runner = new Runner(map, animationSpeed);

	return runner;
}
