import { Direction } from 'Pacman/Utils';
import { Map } from 'Pacman/Map';
import { PacMap } from 'Pacman/Model';
import PacEntity from './PacEntity';

import { vec2, vec3 } from 'Engine/Math';
import { Color } from 'Engine/Utils';

interface IPenState {
	entering: boolean;
	leaving: boolean;
	direction: Direction;
	exitTile: vec2;
	remainingTicks: number;
}

abstract class GhostEntity extends PacEntity {
	protected readonly pacman: PacEntity;
	protected nextDesiredDirection: Direction;

	public ghostMode: GhostEntity.GhostMode;
	protected penState: IPenState;
	protected danceTile: vec2;

	public constructor(model: PacMap, startTile: vec2, facingDirection: Direction, map: Map, pacman: PacEntity) {
		super(model, startTile, facingDirection, map);
		this.pacman = pacman;
		this.danceTile = startTile;

		this.speed = 0.3;
		this.penState = {
			entering: false,
			leaving: this.constructor.name === 'Pinky',
			direction: facingDirection,
			exitTile: new vec2(14, 17),
			remainingTicks: this.constructor.name === 'Inky' ? 50 : this.constructor.name === 'Clyde' ? 100 : 0,
		};
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

		const inPen = this.map.getTileInfo(this.tilePosition) === Map.BasicTileInfo.GHOST_PEN;
		if (inPen) {
			if (!this.penState) {
				this.speed = 0.3;
				this.penState = {
					entering: false,
					leaving: false,
					direction: Direction.UP,
					exitTile: new vec2(14, 17),
					remainingTicks: 100,
				};
			}
		}
		else if (this.penState) {
			this.penState = undefined;
			this.speed = 1;
			this.facing = this.desired = Direction.LEFT;
		}

		if (this.penState) {
			this.inPenTick();
		}
		else {
			const startingPixel = this.pixelPosition;
			super.tick();
			if (startingPixel.exactEquals(this.pixelPosition)) {
				this.updateDesiredDirection();
			}

			// We moved to a new tile
			if (!startingTile.exactEquals(this.tilePosition)) {
				this.updateDesiredDirection();
				switch (this.desired) {
					case Direction.LEFT: this.model.goLeft(); break;
					case Direction.RIGHT: this.model.goRight(); break;
					case Direction.UP: this.model.goUp(); break;
					case Direction.DOWN: this.model.goDown(); break;
				}
				this.model.nextFrame();
			}
		}
	}

	protected inPenTick(): void {
		this.penState.remainingTicks--;
		if (this.penState.remainingTicks <= 0) {
			this.penState.leaving = true;
		}

		// Simple Movement
		{
			this.pixelPosition = PacEntity.move(this.pixelPosition, this.penState.direction);
			switch (this.penState.direction) {
				case Direction.LEFT: this.model.goLeft(); break;
				case Direction.RIGHT: this.model.goRight(); break;
				case Direction.UP: this.model.goUp(); break;
				case Direction.DOWN: this.model.goDown(); break;
			}

			this.model.nextFrame();

			// NOTE: Ensure pixel and tile position is valid, and re-orient if not.
			if (this.pixelPosition.x >= Map.PIXELS_PER_TILE || this.pixelPosition.x < 0 ||
				this.pixelPosition.y >= Map.PIXELS_PER_TILE || this.pixelPosition.y < 0) {
				this.tilePosition = PacEntity.move(this.tilePosition, this.penState.direction);
				this.pixelPosition = this.pixelPosition.cmod(Map.PIXELS_PER_TILE);
			}
		}

		// Update direction
		const exitXPixel = 0;
		const exitYPixel = 4;
		if (this.penState.leaving) {
			if (this.tilePosition.x === this.penState.exitTile.x && this.pixelPosition.x === exitXPixel) {
				this.penState.direction = Direction.UP;
			}
			else if (this.tilePosition.y !== this.penState.exitTile.y || this.pixelPosition.y !== exitYPixel) {
				const tileOffset = Math.sign(this.penState.exitTile.y - this.tilePosition.y);
				if (tileOffset) {
					if (tileOffset > 0) this.penState.direction = Direction.DOWN;
					if (tileOffset < 0) this.penState.direction = Direction.UP;
				}
				else {
					const pixelOffset = Math.sign(exitYPixel - this.pixelPosition.y);
					if (pixelOffset) {
						if (pixelOffset > 0) this.penState.direction = Direction.DOWN;
						if (pixelOffset < 0) this.penState.direction = Direction.UP;
					}
				}
			}
			else {
				const tileOffset = Math.sign(this.penState.exitTile.x - this.tilePosition.x);
				if (tileOffset) {
					if (tileOffset > 0) this.penState.direction = Direction.RIGHT;
					if (tileOffset < 0) this.penState.direction = Direction.LEFT;
				}
				else {
					const pixelOffset = Math.sign(exitXPixel - this.pixelPosition.x);
					if (pixelOffset) {
						if (pixelOffset > 0) this.penState.direction = Direction.RIGHT;
						if (pixelOffset < 0) this.penState.direction = Direction.LEFT;
					}
				}
			}
		}
		else if (this.penState.direction === Direction.UP &&
			this.tilePosition.exactEquals(this.danceTile.addValues(0, -1)) &&
			this.pixelPosition.y > 4) {
			this.penState.direction = Direction.DOWN;
		}
		else if (this.penState.direction === Direction.DOWN &&
			this.tilePosition.exactEquals(this.danceTile.addValues(0, 1)) &&
			this.pixelPosition.y < 4) {
			this.penState.direction = Direction.UP;
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

		this.nextDesiredDirection = shortestDirection;
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
