import Random from './Random';
import Drone from './Drone';
import Runner from './Runner';
import Map from './Map';

export default class Game {
	constructor(seed, spikePercent, playerCodeArray, xSize, ySize) {
		this.started = false;
		this.paused = false;
		this.drones = [];
		this.map = new Map(xSize, ySize);
		for (var i = 0, len = playerCodeArray.length; i < len; i++) {
			this.drones.push(new Drone(playerCodeArray[i], "player" + i, this.map));
		}
		this.map.initialize(new Random(seed), this.drones, spikePercent);
		this.runner = new Runner(this.drones, this.map);
		//if we add any game objects that move on their own we need to generate them here and supply them to the map like the drones so the runner can run them
	}

	start() {
		this.runner.run();
		this.started = true;
	}

	kill() {
		this.runner.kill();
		this.started = false;
	}

	pause() {
		this.runner.pause();
		this.paused = true;
	}

	resume() {
		this.runner.resume();
		this.paused = false;
	}	
}
