import Map from './Map';

export default class TickState {
	protected loopPosition: number = 0;
	protected animating: boolean = false;

	public get isAnimating() {
		return this.animating;
	}

	public update(deltaTime: number, map: Map): void {

		// Get next animation
		if (!this.isAnimating) {
			const player = this.findNextLivingDrone(map);
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
		if (!this.isAnimating) {
			this.animating = map.removeCrashedDrones();
		}
	}

	private findNextLivingDrone(map: Map) {
		const players = map.getPlayers();
		const starting = this.loopPosition;
		let player;
		do {
			this.loopPosition = (this.loopPosition + 1) % players.length;
			player = players[this.loopPosition];
			if (starting === this.loopPosition) return player;
		} while (!player || !player.isAlive());
		return player;
	}
}
