import { GameObject, Drone } from './GameObject';
import { ResizeAnimation } from '../Animations';
import { vec2 } from '../Math';

export default class TickState {
	protected loopPosition: number = 0;
	protected animating: boolean = false;

	public get isAnimating() {
		return this.animating;
	}

	public update(deltaTime: number, players: Drone[], objects: GameObject[], worldSize: vec2): void {

		// Get next animation
		if (!this.isAnimating) {
			const player = this.findNextLivingDrone(players);
			const action = player.controller.getAction();
			player.perform(action, objects, worldSize);
		}

		// Update all objects
		this.animating = false;
		for (const object of objects) {
			const finished = object.update(deltaTime);
			if (!finished) this.animating = true;
		}

		// Remove dead players
		if (!this.isAnimating) {
			this.animating = TickState.removeCrashedDrones(players, objects);
		}
	}

	private findNextLivingDrone(players: Drone[]): Drone {
		const starting = this.loopPosition;
		let player;
		do {
			this.loopPosition = (this.loopPosition + 1) % players.length;
			player = players[this.loopPosition];
			if (starting === this.loopPosition) return player;
		} while (!player || !player.isAlive());
		return player;
	}

	private static removeCrashedDrones(players: Drone[], objects: GameObject[]): boolean {
		const crashed: Drone[] = [];

		for (const player of players.filter((p) => p.isAlive())) {
			for (const object of objects) {
				if (player !== object && player.position.exactEquals(object.position)) {
					crashed.push(player);
				}
			}
		}

		let someoneIsAnimating = false;
		for (const dead of crashed) {
			const gameObjectsIndex = objects.indexOf(dead);
			if (gameObjectsIndex > -1) {
				objects.splice(gameObjectsIndex, 1);
			}

			// TODO: Dont mark drone dead here once map is a scene graph
			dead.alive = false;
			dead.setAnimation(new ResizeAnimation(1, 5, 200), true);
			someoneIsAnimating = true;
		}

		return someoneIsAnimating;
	}
}
