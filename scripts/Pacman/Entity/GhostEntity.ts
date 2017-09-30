import { Direction } from 'Pacman/Utils';
import { Map } from 'Pacman/Map';
import { PacMap } from 'Pacman/Model';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';
import { Color } from 'Engine/Utils';

abstract class GhostEntity extends PacEntity {
	protected readonly pacman: PacEntity;
	protected nextDesiredDirection: Direction;

	public ghostMode: GhostEntity.GhostMode;

	public constructor(model: PacMap, startTile: vec2, facingDirection: Direction, map: Map, pacman: PacEntity) {
		super(model, startTile, facingDirection, map);
		this.pacman = pacman;
	}

	protected get roundingSize(): number { return 0; }
	protected get followRestrictions(): boolean { return true; }

	public abstract getTargetTile(): vec2;

	public setGhostMode(newMode: GhostEntity.GhostMode, reverse: boolean = true) {
		this.ghostMode = newMode;
		if (reverse) {
			// TODO: If ghost is in a tile against a wall, the ghost could turn around into the wall and get stuck
			this.facing = Direction.getOpposite(this.facing);
			this.nextDesiredDirection = undefined;
			this.desired = this.facing;
			this.updateDesiredDirection();
		}
	}

	protected tick(): void {
		const startingTile = this.tilePosition;
		super.tick();

		// We moved to a new tile
		if (!startingTile.exactEquals(this.tilePosition)) {
			this.updateDesiredDirection();
			switch (this.facing) {
				case Direction.LEFT: this.model.goLeft(); break;
				case Direction.RIGHT: this.model.goRight(); break;
				case Direction.UP: this.model.goUp(); break;
				case Direction.DOWN: this.model.goDown(); break;
			}
			this.model.nextFrame();
		}
	}

	/**
	 * Update the desired direction of this ghost to the next direction. Scan surrounding tiles of the
	 * next tile to figure out where this ghost will move next
	 */
	protected updateDesiredDirection(): void {
		if (this.nextDesiredDirection === undefined) this.nextDesiredDirection = this.desired;
		this.setDesiredDirection(this.nextDesiredDirection);

		const nextTile = PacEntity.move(this.tilePosition, this.desired);

		const invalidOpposite = Direction.getOpposite(this.desired);
		// NOTE: The order of this array is the tie-breaker order
		const options = [
			Direction.UP,
			Direction.LEFT,
			Direction.DOWN,
			Direction.RIGHT,
		].filter((d) => d !== invalidOpposite);

		let shortestDistance = Number.MAX_SAFE_INTEGER;
		let shortestDirection;
		for (const direction of options) {
			const testTile = PacEntity.move(nextTile, direction);
			if (this.map.canMoveToTile(testTile, direction)) {
				const distanceToTarget = testTile.sqrDist(this.getTargetTile());
				if (distanceToTarget < shortestDistance) {
					shortestDistance = distanceToTarget;
					shortestDirection = direction;
				}
			}
		}

		if (shortestDirection !== undefined) {
			this.nextDesiredDirection = shortestDirection;
		}
		else {
			console.log('Some how got an invalid next direction..');
		}
	}
}

namespace GhostEntity {
	export enum GhostMode {
		CHASE = 'CHASE',
		SCATTER = 'SCATTER',
		FRIGHTENED = 'FRIGHTENED',
	}
}

export default GhostEntity;
