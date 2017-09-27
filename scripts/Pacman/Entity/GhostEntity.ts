import PacEntity from './PacEntity';
import { Map } from '../Map';

import { vec2 } from 'Engine/Math';
import { Color } from 'Engine/Utils';

abstract class GhostEntity extends PacEntity {
	protected readonly pacmanTarget: PacEntity;
	protected nextDesiredDirection: PacEntity.Direction;

	public ghostMode: GhostEntity.GhostMode;
	protected ghostModeDuration: number;

	public constructor(startTile: vec2, facingDirection: PacEntity.Direction, color: Color,
		map: Map, pacmanTarget: PacEntity) {
		super(startTile, facingDirection, color, map);
		this.pacmanTarget = pacmanTarget;
		this.setGhostMode(GhostEntity.GhostMode.SCATTER, 14 * 1000, false);
	}

	protected get roundingSize(): number { return 0; }

	public abstract getTargetTile(): vec2;

	public setGhostMode(newMode: GhostEntity.GhostMode, duration: number, reverse: boolean = true) {
		console.log(`Changing ghost mode for ${this.constructor.name} to be ${newMode}`);
		this.ghostMode = newMode;
		this.ghostModeDuration = duration;
		if (reverse) {
			this.facing = PacEntity.Direction.getOpposite(this.facing);
			this.nextDesiredDirection = undefined;
			this.desired = this.facing;
			this.updateDesiredDirection();
		}
	}

	public update(deltaTime: number): boolean {
		// TODO: Change ghost update. This could cause timing issues with ghost modes the way it works
		// It is possible to run more than a single tick per update, and updating mode time is only
		// happening once per udpate
		const result = super.update(deltaTime);

		this.ghostModeDuration -= deltaTime;
		if (this.ghostModeDuration <= 0) {
			// TODO: Need a better way to get next modes duration
			this.setGhostMode(
				this.ghostMode === GhostEntity.GhostMode.SCATTER ? GhostEntity.GhostMode.CHASE : GhostEntity.GhostMode.SCATTER,
				this.ghostModeDuration = 7 * 1000);
		}

		return result;
	}

	protected tick(): void {
		const startingTile = this.tilePosition;
		super.tick();

		// We moved to a new tile
		if (!startingTile.exactEquals(this.tilePosition)) {
			this.updateDesiredDirection();
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

		const invalidOpposite = PacEntity.Direction.getOpposite(this.desired);
		// NOTE: The order of this array is the tie-breaker order
		const options = [
			PacEntity.Direction.UP,
			PacEntity.Direction.LEFT,
			PacEntity.Direction.DOWN,
			PacEntity.Direction.RIGHT,
		].filter((d) => d !== invalidOpposite);

		let shortestDistance = Number.MAX_SAFE_INTEGER;
		let shortestDirection;
		for (const direction of options) {
			const testTile = PacEntity.move(nextTile, direction);
			if (this.map.canMoveToTile(testTile)) {
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

// tslint:disable-next-line:no-namespace
namespace GhostEntity {
	export enum GhostMode {
		CHASE = 'CHASE',
		SCATTER = 'SCATTER',
		FRIGHTENED = 'FRIGHTENED',
	}
}

export default GhostEntity;
