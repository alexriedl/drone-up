import { BaseObject } from './GameObject';
import Map from './Map';

export default class TickState {
	protected loopPosition: number = 0;
	protected animatingObjects: BaseObject[] = [];

	public isAnimating(): boolean {
		return this.animatingObjects && this.animatingObjects.length > 0;
	}

	public update(deltaTime: number, map: Map): BaseObject[] {
		const players = map.getPlayers();

		if (!this.isAnimating()) {
			this.loopPosition = (this.loopPosition + 1) % players.length;
			const player = players[this.loopPosition];
			const action = player.controller.getAction();
			this.animatingObjects = player.perform(action, map);
		}

		// NOTE: Do not change this to an else. The first if statement may make this become true
		if (this.isAnimating()) {
			const removes = [];

			for (const ao of this.animatingObjects) {
				const finished = ao.updateAnimation(deltaTime);
				if (finished) removes.push(ao);
			}

			for (const remove of removes) {
				const index = this.animatingObjects.indexOf(remove);
				if (index > -1) {
					this.animatingObjects.splice(index, 1);
				}
			}

			if (!this.isAnimating()) {
				// TODO: Add crash animation
				const deadDrones = map.removeCrashedDrones();
				if (deadDrones && deadDrones.length > 0) {
					deadDrones.forEach((drone) => {
						drone.setAnimation(null);
					});
					this.animatingObjects = deadDrones;
				}
			}

			return this.animatingObjects;
		}
	}
}
