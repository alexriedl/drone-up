import { MapTile, Map, OriginalMap } from 'Pacman/Map';

import { Color, Random } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle, SimpleRectangle } from 'Engine/Model';
import { vec2, vec3 } from 'Engine/Math';

class PacEntity extends Entity {
	private facing: PacEntity.Direction;
	private desired: PacEntity.Direction;
	private tilePosition: vec2;
	private pixelPosition: vec2;

	private randomizer: Random;
	public map: Map;

	private burn: number = 0;
	private showDesired: Entity;

	// TODO: Map should not need to be passed into entity
	public constructor(startTile: vec2, facingDirection: PacEntity.Direction, map: Map, randomizer: Random) {
		super(new SimpleRectangle(Color.YELLOW));

		// TODO: Conversion between tiles and pixels in entity is strange...
		this.tilePosition = startTile;
		this.pixelPosition = new vec2(Map.PIXELS_PER_TILE - 1, Map.PIXELS_PER_TILE / 2);
		this.scale = new vec3(16, 16, 1);
		this.facing = facingDirection;
		this.desired = facingDirection;
		this.map = map;
		this.randomizer = randomizer;

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

	public setDesiredDirection(direction: PacEntity.Direction): void {
		this.desired = direction;
		this.showDesired.position = PacEntity.move(new vec2(), direction).scale(0.6).toVec3(0);
	}

	// TODO: Limit max deltaTime to be a reasonable value to avoid some strange large frame problems?
	public update(deltaTime: number): boolean {
		this.burn += deltaTime;
		const step = 100;

		while (this.burn >= step) {
			this.burn -= step;
			this.tick();
		}

		return super.update(deltaTime);
	}

	private tick(): void {
		const xCenter = 4; // NOTE: Original game used 3. Rendering off by one...
		const yCenter = 4;
		const roundingSize = 4;

		let nextTile: vec2;
		if (this.desired !== this.facing) {
			if (
				((this.desired === PacEntity.Direction.LEFT || this.desired === PacEntity.Direction.RIGHT) &&
					Math.abs(this.pixelPosition.y - yCenter) <= roundingSize) ||
				((this.desired === PacEntity.Direction.UP || this.desired === PacEntity.Direction.DOWN) &&
					Math.abs(this.pixelPosition.x - xCenter) <= roundingSize)) {

				nextTile = PacEntity.move(this.tilePosition, this.desired);
				const canMove = this.map.canMoveToTile(nextTile);
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
			if ((this.facing === PacEntity.Direction.LEFT && nextPixel.x < xCenter) ||
				(this.facing === PacEntity.Direction.RIGHT && nextPixel.x > xCenter) ||
				(this.facing === PacEntity.Direction.UP && nextPixel.y < yCenter) ||
				(this.facing === PacEntity.Direction.DOWN && nextPixel.y > yCenter)) {
				nextTile = PacEntity.move(this.tilePosition, this.facing);
				const canMove = this.map.canMoveToTile(nextTile);
				if (canMove) this.pixelPosition = nextPixel;
			}
			else {
				nextTile = this.tilePosition;
				this.pixelPosition = nextPixel;
			}
		}

		let adjust;
		if (this.facing === PacEntity.Direction.UP || this.facing === PacEntity.Direction.DOWN) {
			adjust = new vec2(Math.sign(xCenter - this.pixelPosition.x), 0);
		}
		else {
			adjust = new vec2(0, Math.sign(yCenter - this.pixelPosition.y));
		}
		if (adjust.x || adjust.y) this.pixelPosition = this.pixelPosition.add(adjust);

		// TODO: Need to support wrapping
		// NOTE: Ensure pixel position is valid
		if (this.pixelPosition.x >= Map.PIXELS_PER_TILE || this.pixelPosition.x < 0 ||
			this.pixelPosition.y >= Map.PIXELS_PER_TILE || this.pixelPosition.y < 0) {
			this.tilePosition = this.tilePosition.exactEquals(nextTile) ? nextTile : this.map.orientCoords(nextTile);
			this.pixelPosition = this.pixelPosition.cmod(Map.PIXELS_PER_TILE);
		}
	}
}

// tslint:disable-next-line:no-namespace
namespace PacEntity {
	export enum Direction { RIGHT, LEFT, UP, DOWN }
	export namespace Direction {
		export function isOpposite(d1: Direction, d2: Direction): boolean {
			switch (d1) {
				case Direction.RIGHT: return d2 === Direction.LEFT;
				case Direction.LEFT: return d2 === Direction.RIGHT;
				case Direction.UP: return d2 === Direction.DOWN;
				case Direction.DOWN: return d2 === Direction.UP;
				default: return false;
			}
		}
	}

	export function move(pos: vec2, direction: Direction): vec2 {
		switch (direction) {
			case Direction.RIGHT: return new vec2(pos.x + 1, pos.y + 0);
			case Direction.LEFT: return new vec2(pos.x - 1, pos.y + 0);
			case Direction.UP: return new vec2(pos.x + 0, pos.y - 1);
			case Direction.DOWN: return new vec2(pos.x + 0, pos.y + 1);
		}
	}
}

export default PacEntity;
