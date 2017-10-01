import { Map } from 'Pacman/Map';
import Blinky from './Blinky';
import Clyde from './Clyde';
import GhostEntity from './GhostEntity';
import Inky from './Inky';
import Pacman from './Pacman';
import Pinky from './Pinky';

import { Entity } from 'Engine/Entity';

export default class GhostParent extends Entity {
	protected readonly children?: GhostEntity[] = [];
	private static nextModeDuration: number = 7.5 * 1000;
	private currentGhostMode: GhostEntity.GhostMode;
	private ghostModeDuration: number = 0;
	private swaps = 4;

	// TODO: Change ghost update. This could cause timing issues with ghost modes the way it works It
	// is possible to run more than a single tick per update, and updating mode time is only
	// happening once per update. The issue could be that the mode should change after the first
	// tick, but before the second tick for the ghosts
	public update(deltaTime: number): boolean {
		this.ghostModeDuration -= deltaTime;
		if (this.ghostModeDuration <= 0 && this.swaps > 0) {
			this.swaps--;
			this.currentGhostMode = this.currentGhostMode === GhostEntity.GhostMode.SCATTER ?
				GhostEntity.GhostMode.CHASE : GhostEntity.GhostMode.SCATTER;
			this.ghostModeDuration += GhostParent.nextModeDuration;

			this.children.forEach((child) => {
				child.setGhostMode(this.currentGhostMode);
			});
		}

		return super.update(deltaTime);
	}

	public setupGhosts(map: Map, pacman: Pacman): void {
		const blinky = new Blinky(map, pacman);
		blinky.setParent(this);

		const pinky = new Pinky(map, pacman);
		pinky.setParent(this);

		const inky = new Inky(map, pacman, blinky);
		inky.setParent(this);

		const clyde = new Clyde(map, pacman);
		clyde.setParent(this);

		this.children.forEach((child) => {
			child.setGhostMode(GhostEntity.GhostMode.SCATTER, true);
		});
	}
}
