import { Direction } from 'Pacman/Utils';
import { MapTile, Map, OriginalMap } from 'Pacman/Map';
import { PacMap } from 'Pacman/Model';

import { Entity } from 'Engine/Entity';
import { vec2, vec3 } from 'Engine/Math';

export default abstract class PacEntity extends Entity {
	protected model: PacMap;
	public facing: Direction;
	public desired: Direction;
	public tilePosition: vec2;
	public pixelPosition: vec2;

	protected parent?: Map;

	protected speed: number = 1;
	private burn: number = 0;

	// TODO: Map should not need to be passed into entity
	public constructor(model: PacMap, startTile: vec2, facingDirection: Direction, map: Map) {
		super(model);

		// TODO: Conversion between tiles and pixels in entity is strange...
		this.tilePosition = startTile;
		this.pixelPosition = new vec2(0, Map.PIXELS_PER_TILE / 2);
		this.scale = new vec3(16, 16, 1);
		this.facing = facingDirection;
		this.desired = facingDirection;
	}

	public get position(): vec3 { return this.tilePosition.scale(Map.PIXELS_PER_TILE).add(this.pixelPosition).toVec3(0); }
	public set position(value: vec3) { return; }
	protected get roundingSize(): number { return 4; }
	protected get followRestrictions(): boolean { return false; }

	public setDesiredDirection(direction: Direction): void {
		this.desired = direction;
	}

	public update(deltaTime: number): boolean {
		this.burn += deltaTime;
		const step = 20 / this.speed;

		while (this.burn >= step) {
			this.burn -= step;
			this.tick();
		}

		return super.update(deltaTime);
	}

	protected tick(): void {
		const xCenter = 4; // NOTE: Original game used 3. Rendering off by one...
		const yCenter = 4;

		let nextTile: vec2;
		if (this.desired !== this.facing) {
			if (
				((this.desired === Direction.LEFT || this.desired === Direction.RIGHT) &&
					Math.abs(this.pixelPosition.y - yCenter) <= this.roundingSize) ||
				((this.desired === Direction.UP || this.desired === Direction.DOWN) &&
					Math.abs(this.pixelPosition.x - xCenter) <= this.roundingSize)) {

				nextTile = PacEntity.move(this.tilePosition, this.desired);
				const canMove = this.parent.canMoveToTile(nextTile, this.followRestrictions ? this.desired : undefined);
				if (canMove) {
					this.facing = this.desired;
					this.pixelPosition = PacEntity.move(this.pixelPosition, this.facing);
				}
				else {
					nextTile = undefined;
				}
			}
		}

		if (!nextTile) {
			const nextPixel = PacEntity.move(this.pixelPosition, this.facing);
			if ((this.facing === Direction.LEFT && nextPixel.x < xCenter) ||
				(this.facing === Direction.RIGHT && nextPixel.x > xCenter) ||
				(this.facing === Direction.UP && nextPixel.y < yCenter) ||
				(this.facing === Direction.DOWN && nextPixel.y > yCenter)) {
				nextTile = PacEntity.move(this.tilePosition, this.facing);
				const canMove = this.parent.canMoveToTile(nextTile, this.followRestrictions ? this.facing : undefined);
				if (canMove) this.pixelPosition = nextPixel;
			}
			else {
				nextTile = this.tilePosition;
				this.pixelPosition = nextPixel;
			}
		}

		let adjust;
		if (this.facing === Direction.UP || this.facing === Direction.DOWN) {
			adjust = new vec2(Math.sign(xCenter - this.pixelPosition.x), 0);
		}
		else {
			adjust = new vec2(0, Math.sign(yCenter - this.pixelPosition.y));
		}
		if (adjust.x || adjust.y) this.pixelPosition = this.pixelPosition.add(adjust);

		// NOTE: Ensure pixel and tile position is valid, and re-orient if not.
		if (this.pixelPosition.x >= Map.PIXELS_PER_TILE || this.pixelPosition.x < 0 ||
			this.pixelPosition.y >= Map.PIXELS_PER_TILE || this.pixelPosition.y < 0) {
			this.tilePosition = this.tilePosition.exactEquals(nextTile) ? nextTile : this.parent.orientCoords(nextTile);
			this.pixelPosition = this.pixelPosition.cmod(Map.PIXELS_PER_TILE);
		}
	}

	protected static move(pos: vec2, direction: Direction): vec2 {
		return pos.add(Direction.getVector(direction));
	}
}
