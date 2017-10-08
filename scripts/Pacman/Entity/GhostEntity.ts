import { Direction } from 'Pacman/Utils';
import { Map } from 'Pacman/Map';
import { PacMap } from 'Pacman/Model';
import PacEntity from './PacEntity';

import { vec2, vec3, mat4 } from 'Engine/Math';

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

	public constructor(model: PacMap, startTile: vec2, facingDirection: Direction, pacman: PacEntity) {
		super(model, startTile, facingDirection);
		this.pacman = pacman;
		this.danceTile = startTile;
	}

	protected get roundingSize(): number { return 0; }
	protected get followRestrictions(): boolean { return true; }

	public abstract getTargetTile(): vec2;

	public setDesired(direction: Direction) {
		if (!direction) return;
		super.setDesired(direction);
		switch (direction) {
			case Direction.LEFT: this.model.goLeft(); break;
			case Direction.RIGHT: this.model.goRight(); break;
			case Direction.UP: this.model.goUp(); break;
			case Direction.DOWN: this.model.goDown(); break;
		}
		this.model.nextFrame();
	}

	public setGhostMode(newMode: GhostEntity.GhostMode, reverse: boolean = true) {
		this.ghostMode = newMode;
		if (reverse) {
			// TODO: If ghost is in a tile against a wall, the ghost could turn around into the wall and get stuck
			this.facing = Direction.getOpposite(this.facing);
			this.nextDesiredDirection = undefined;
			this.setDesired(this.facing);
			this.updateDesiredDirection();
		}
	}

	protected enterPen(facing: Direction = Direction.DOWN): void {
		this.speed = 30;
		this.penState = {
			entering: false,
			leaving: this.constructor.name === 'Pinky',
			direction: facing,
			exitTile: new vec2(14, 17),
			remainingTicks: this.constructor.name === 'Inky' ? 50 : this.constructor.name === 'Clyde' ? 100 : 0,
		};
		this.setDesired(this.penState.direction);
	}

	public reset(): void {
		super.reset();
		this.nextDesiredDirection = undefined;
		this.enterPen(this.facing);
	}

	protected onTileChange(oldPixelPos: vec2): void {
		if (this.penState) return;
		this.updateDesiredDirection();
	}

	protected tick(): void {
		switch (this.ghostMode) { case GhostEntity.GhostMode.HIDDEN: return; }

		const tileInfo = this.parent.getTileInfo(this.tilePosition);

		switch (tileInfo) {
			case Map.BasicTileInfo.GHOST_PEN:
				if (!this.penState) {
					this.enterPen();
				}
				break;
			case Map.BasicTileInfo.SLOW:
				this.speed = 40;
				break;
			default:
				this.speed = PacEntity.MAX_SPEED;
				if (this.penState) {
					this.penState = undefined;
					this.facing = Direction.LEFT;
					this.setDesired(this.facing);
				}
				break;
		}

		if (this.penState) this.inPenTick();
		else super.tick();
	}

	protected inPenTick(): void {
		this.penState.remainingTicks--;
		if (this.penState.remainingTicks <= 0) {
			this.penState.leaving = true;
		}

		// Simple Movement
		{
			this.pixelPosition = PacEntity.move(this.pixelPosition, this.penState.direction);
			this.setDesired(this.penState.direction);

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

	protected updateDesiredDirection(): void {
		let desired = this.nextDesiredDirection || this.desired;
		let nextTile = PacEntity.move(this.tilePosition, desired);

		// NOTE: If new direction is pointing towards a wall, recalculate direction
		const tileInfo = this.parent.getTileInfo(nextTile);
		if (tileInfo === Map.BasicTileInfo.BLOCK) {
			desired = this.getValidDirection(this.tilePosition);
			nextTile = PacEntity.move(this.tilePosition, desired);
		}

		this.setDesired(desired);
		this.nextDesiredDirection = this.getValidDirection(nextTile, desired);
	}

	private getValidDirection(currentTile: vec2, currentDirection?: Direction): Direction {
		const invalidOpposite = currentDirection && Direction.getOpposite(currentDirection);
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
			const testTile = PacEntity.move(currentTile, direction);
			if (this.parent.canMoveToTile(testTile, direction)) {
				const distanceToTarget = testTile.sqrDist(this.getTargetTile());
				if (distanceToTarget < shortestDistance) {
					shortestDistance = distanceToTarget;
					shortestDirection = direction;
				}
			}
		}

		return shortestDirection;
	}

	public render(gl: WebGLRenderingContext, vpMatrix: mat4, overridePosition?: vec3, overrideScale?: vec3): void {
		switch (this.ghostMode) { case GhostEntity.GhostMode.HIDDEN: return; }
		super.render(gl, vpMatrix, overridePosition, overrideScale);
	}
}

namespace GhostEntity {
	export enum GhostMode {
		CHASE = 'CHASE',
		SCATTER = 'SCATTER',
		FRIGHTENED = 'FRIGHTENED',
		HIDDEN = 'HIDDEN',
	}
}

export default GhostEntity;
