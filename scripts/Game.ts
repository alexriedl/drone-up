import { Controller } from './Bots/PremadeBots';
import { Random } from './Utils';
import Drone from './GameObjects/Drone';
import Map from './Map';
import Runner from './Runner';

export default class Game {
	private drones: Drone[];
	private map: Map;
	private runner: Runner;
	private paused: boolean;
	private started: boolean;

	public constructor(seed: number, spikePercent: number, playerControllers: Controller[], xSize: number, ySize: number) {
		this.drones = [];
		this.map = new Map(xSize, ySize);
		this.paused = false;
		this.started = false;

		for (var i = 0, len = playerControllers.length; i < len; i++) {
			this.drones.push(new Drone("player" + i, playerControllers[i]));
		}
		this.map.initialize(new Random(seed), this.drones, spikePercent);

		this.runner = new Runner(this.drones, this.map);
		//if we add any game objects that move on their own we need to generate them here and supply them to the map like the drones so the runner can run them
	}

	public start(): void {
		//this.runner.run();
		this.runner.runWithAnimations();
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
}