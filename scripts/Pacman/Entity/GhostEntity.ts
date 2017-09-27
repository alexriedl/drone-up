import PacEntity from './PacEntity';
import { Map } from '../Map';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class GhostEntity extends PacEntity {
	public readonly pacmanTarget: PacEntity;
	protected nextDesiredDirection: PacEntity.Direction;

	public constructor(startTile: vec2, facingDirection: PacEntity.Direction, color: Color,
		map: Map, randomizer: Random, pacmanTarget: PacEntity) {
		super(startTile, facingDirection, color, map, randomizer);

		this.pacmanTarget = pacmanTarget;
		this.nextDesiredDirection = PacEntity.Direction.LEFT;
	}

	public get targetTile(): vec2 {
		return this.pacmanTarget.tilePosition;
	}

	protected tick(): void {
		const startingTile = this.tilePosition;
		super.tick();

		// We moved to a new tile
		if (!startingTile.exactEquals(this.tilePosition)) {
			const nextTile = PacEntity.move(this.tilePosition, this.desired);

			const invalidOpposite = PacEntity.Direction.getOpposite(this.desired);
			// NOTE: The order of this array is the tie-breaker order
			const options = [
				PacEntity.Direction.UP,
				PacEntity.Direction.LEFT,
				PacEntity.Direction.DOWN,
				PacEntity.Direction.RIGHT,
			].filter((d) => d !== invalidOpposite);

			let shortestDistance = 99999;
			let shortestDirection;
			for (const direction of options) {
				const testTile = PacEntity.move(nextTile, direction);
				if (this.map.canMoveToTile(testTile)) {
					const distanceToTarget = testTile.dist(this.targetTile);
					if (distanceToTarget < shortestDistance) {
						shortestDistance = distanceToTarget;
						shortestDirection = direction;
					}
				}
			}

			if (shortestDirection) {
				this.setDesiredDirection(this.nextDesiredDirection);
				this.nextDesiredDirection = shortestDirection;
			}
			else {
				console.log('Some how got an invalid next direction..');
			}
		}
	}
}
