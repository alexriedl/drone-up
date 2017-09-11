import { Controller } from './Bots/PremadeBots';
import { Drone } from './GameObject';
import { Random, Color } from './Utils';
import { SimpleDrone, SimpleSpike } from './Model';
import Map from './Map';
import Runner from './Runner';

export default class Game {
	private map: Map;
	private paused: boolean;
	private runner: Runner;
	private started: boolean;

	public constructor(randomizer: Random, spikePercent: number, playerControllers: Controller[],
		xSize: number, ySize: number) {
		this.map = new Map(xSize, ySize);
		this.paused = false;
		this.started = false;

		const createDroneModel = (id: string) => new SimpleDrone(this.getNextPlayerColor(randomizer));
		const createSpikeModel = (id: string) => new SimpleSpike();

		const drones = [];
		for (let i = 0; i < playerControllers.length; i++) {
			const controller = playerControllers[i];
			const ID = `player${i}`;
			drones.push(new Drone(ID, createDroneModel(ID), controller));
		}
		this.map.initialize(randomizer, drones, spikePercent, createSpikeModel);

		const animationSpeed = 1;
		this.runner = new Runner(this.map, animationSpeed);

		// if we add any game objects that move on their own we need to generate them here and supply them
		// to the map like the drones so the runner can run them
	}

	public start(): void {
		this.runner.run();
		this.started = true;
	}

	public kill(): void {
		this.runner.kill();
		this.started = false;
	}

	public pause(): void {
		this.runner.pause();
		this.paused = true;
	}

	public resume(): void {
		this.runner.resume();
		this.paused = false;
	}

	public isStarted(): boolean {
		return this.started;
	}

	public isPaused(): boolean {
		return this.paused;
	}

	private predefinedColors: Color[] = [
		// new Color(0, 0, 0),
		new Color(0, 0, 1),
		new Color(0, 1, 0),
		new Color(0, 1, 1),
		new Color(1, 0, 0),
		new Color(1, 0, 1),
		new Color(1, 1, 0),
		// new Color(1, 1, 1),
	];

	private getNextPlayerColor(randomizer: Random): Color {
		if (this.predefinedColors && this.predefinedColors.length > 0) {
			return this.predefinedColors.pop();
		}
		else {
			const r = () => randomizer.nextRangeFloat(0.3, 1);
			return new Color(r(), r(), r());
		}
	}
}
