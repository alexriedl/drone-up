import { Direction } from 'Pacman/Utils';
import { MapTile, Map, OriginalMap } from 'Pacman/Map';

import { Color } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle, SimpleRectangle } from 'Engine/Model';
import { vec2, vec3 } from 'Engine/Math';

export default abstract class PacEntity extends Entity {
	public facing: Direction;
	public desired: Direction;
	public tilePosition: vec2;
	public pixelPosition: vec2;

	public map: Map;

	private burn: number = 0;
	private showDesired: Entity;

	// TODO: Map should not need to be passed into entity
	public constructor(startTile: vec2, facingDirection: Direction, color: Color, map: Map) {
		super(new SimpleRectangle(color));

		// TODO: Conversion between tiles and pixels in entity is strange...
		this.tilePosition = startTile;
		this.pixelPosition = new vec2(Map.PIXELS_PER_TILE - 1, Map.PIXELS_PER_TILE / 2);
		this.scale = new vec3(16, 16, 1);
		this.facing = facingDirection;
		this.desired = facingDirection;
		this.map = map;

		const sdModel = new SimpleRectangle(Color.RED);
		this.showDesired = new Entity(sdModel, new vec3(), new vec3(1 / 8, 1 / 8, 1));
		this.showDesired.setParent(this);

		/*
		Expected things that will need to be passed to each PacEntity are listed below. It is expected
		each type of entity would extend this class and pass the obvious requirements down directly.

		- Model
			- Models per direction?
			- Models per animation frame?
		- Movement behavior
		- ?? How does ghost modes work? directly to behavior, and that passes the differences down, or
		change the behavior to the new mode when it needs to.
		- ?? How to show ghost vs frightened?
		- ?? How to entity speeds get updated for different levels / or within a single level?
		*/
	}

	public get position(): vec3 { return this.tilePosition.scale(Map.PIXELS_PER_TILE).add(this.pixelPosition).toVec3(0); }
	public set position(value: vec3) { console.log("Ignoring direct set of PacEntity's position value"); }
	protected get roundingSize(): number { return 4; }
	protected get followRestrictions(): boolean { return false; }

	public setDesiredDirection(direction: Direction): void {
		this.desired = direction;
		this.showDesired.position = PacEntity.move(new vec2(), direction).scale(0.6).toVec3(0);
	}

	public update(deltaTime: number): boolean {
		this.burn += deltaTime;
		const step = 20;

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
				const canMove = this.map.canMoveToTile(nextTile, this.followRestrictions ? this.desired : undefined);
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
				const canMove = this.map.canMoveToTile(nextTile, this.followRestrictions ? this.facing : undefined);
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
			this.tilePosition = this.tilePosition.exactEquals(nextTile) ? nextTile : this.map.orientCoords(nextTile);
			this.pixelPosition = this.pixelPosition.cmod(Map.PIXELS_PER_TILE);
		}
	}

	protected static move(pos: vec2, direction: Direction): vec2 {
		return pos.add(Direction.getVector(direction));
	}
}
