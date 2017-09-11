import { GameObject } from './GameObject';
import Map from './Map';

export default class TickState {
	public loopPosition: number = 0;
	public animatingObjects: GameObject[] = [];

	public isAnimating(): boolean {
		return this.animatingObjects && this.animatingObjects.length > 0;
	}

	public update(deltaTime: number, map: Map) {
		const players = map.getPlayers();

		if (!this.isAnimating()) {
			this.loopPosition = (this.loopPosition + 1) % players.length;
			const player = players[this.loopPosition];
			const action = player.controller.getAction();
			this.animatingObjects = player.perform(action, map);
		}

		// NOTE: Do not change this to an else. The first if statement may make this become true
		if (this.isAnimating()) {
			const animationRemovalIndices = [];

			for (let i = 0; i < this.animatingObjects.length; i++) {
				const ao = this.animatingObjects[i];
				const finished = ao.updateAnimation(deltaTime);
				if (finished) animationRemovalIndices.push(i);
			}

			for (const index of animationRemovalIndices) {
				this.animatingObjects.splice(index, 1);
			}

			if (!this.isAnimating()) {
				// TODO: Find a way to animate dead drones
				const deadDrones = map.removeCrashedDrones();
			}
		}
	}
}
