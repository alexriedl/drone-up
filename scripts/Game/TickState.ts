import Map from './Map';

export default class TickState {
	protected loopPosition: number = 0;
	protected animating: boolean = false;

	public isAnimating(): boolean {
		return this.animating;
	}

	public update(deltaTime: number, map: Map): void {

		// Get next animation
		if (!this.isAnimating()) {
			const players = map.getPlayers();
			this.loopPosition = (this.loopPosition + 1) % players.length;
			const player = players[this.loopPosition];
			const action = player.controller.getAction();
			player.perform(action, map);
		}

		// Update all objects
		this.animating = false;
		const objects = map.getGameObjects();
		for (const object of objects) {
			const finished = object.update(deltaTime);
			if (!finished) this.animating = true;
		}

		// Remove dead players
		// TODO: Generilze this. Maybe move it out of here entirely
		const deadDrones = map.removeCrashedDrones();
		if (deadDrones && deadDrones.length > 0) {
			deadDrones.forEach((drone) => {
				drone.setAnimation(null);
			});
		}
	}
}
