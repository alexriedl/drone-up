import PacEntity from './PacEntity';
import { Map } from '../Map';

import { vec2 } from 'Engine/Math';
import { Color } from 'Engine/Utils';

export default abstract class GhostEntity extends PacEntity {
	protected readonly pacmanTarget: PacEntity;
	protected nextDesiredDirection: PacEntity.Direction;

	public constructor(startTile: vec2, facingDirection: PacEntity.Direction, color: Color,
		map: Map, pacmanTarget: PacEntity) {
		super(startTile, facingDirection, color, map);
		this.pacmanTarget = pacmanTarget;
	}

	protected get roundingSize(): number { return 0; }

	public abstract getTargetTile(): vec2;

	protected tick(): void {
		const startingTile = this.tilePosition;
		super.tick();

		// We moved to a new tile
		if (!startingTile.exactEquals(this.tilePosition)) {
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
}
