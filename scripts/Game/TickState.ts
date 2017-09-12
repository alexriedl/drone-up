import { BaseObject } from './GameObject';
import Map from './Map';

export default class TickState {
	protected loopPosition: number = 0;
	protected transientObjects: BaseObject[] = [];
	protected animating: boolean;

	public isAnimating(): boolean {
		return this.animating;
	}

	public update(deltaTime: number, map: Map) {
		const players = map.getPlayers();

		if (!this.isAnimating()) {
			this.loopPosition = (this.loopPosition + 1) % players.length;
			const player = players[this.loopPosition];
			const action = player.controller.getAction();
			this.transientObjects = player.perform(action, map);
			this.animating = true;
		}

		// NOTE: Do not change this to an else. The first if statement may make this become true
		if (this.animating) {
			const animationRemovalIndices = [];
			let stillAnimating = false;

			for (const go of map.getGameObjects()) {
				const finished = go.updateAnimation(deltaTime);
				if (!finished) stillAnimating = true;
			}

			for (let i = 0; i < this.transientObjects.length; i++) {
				const ao = this.transientObjects[i];
				const finished = ao.updateAnimation(deltaTime);
				if (finished) animationRemovalIndices.push(i);
			}

			for (const index of animationRemovalIndices) {
				this.transientObjects.splice(index, 1);
			}

			this.animating = (this.transientObjects && this.transientObjects.length > 0) || stillAnimating;

			if (!this.animating) {
				// TODO: Find a way to animate dead drones
				const deadDrones = map.removeCrashedDrones();
				if (deadDrones && deadDrones.length > 0) {
					deadDrones.forEach((drone) => {
						drone.setAnimation(null);
					});
					this.transientObjects = deadDrones;
				}
			}
		}
	}
}
