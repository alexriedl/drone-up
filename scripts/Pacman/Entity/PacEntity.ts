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
		this.showDesired = new Entity(sdModel, new vec3(), new vec3(1 / 16, 1 / 16, 1));
		this.showDesired.setParent(this);
	}

	public get position(): vec3 { return this.tilePosition.scale(Map.PIXELS_PER_TILE).add(this.pixelPosition).toVec3(0); }
	public set position(value: vec3) { console.log("Ignoring direct set of PacEntity's position value"); }

	public setDesiredDirection(direction: PacEntity.Direction): void {
		this.desired = direction;
		this.showDesired.position = PacEntity.move(new vec2(), direction).scale(1 / 4).toVec3(0);
	}

	// TODO: Perhaps limit max deltaTime to be a reasonable value to avoid some strange large frame problems
	public update(deltaTime: number): boolean {
		// TODO: Build a speed into the update based on deltaTime
		// TODO: Does multiple updates per frame need to be supported?
		// If based on the speed this entity wants to move more than one pixel, put this logic in a loop.
		// Iterate over all update logic so no entity moves multiple pixels per update and clips through
		// walls or causes other issues

		this.burn += deltaTime;
		const step = 100;
		if (this.burn > step) {
			this.burn -= step;
		}
		else {
			return;
		}

		let nextTile;
		if (this.desired !== this.facing) {
			nextTile = PacEntity.move(this.tilePosition, this.desired);
			const tileEnum = this.map.tiles[nextTile.y][nextTile.x];
			const canMove = this.canWalkOnTile(tileEnum);
			if (canMove) {
				this.pixelPosition = PacEntity.move(this.pixelPosition, this.desired);
				this.facing = this.desired;
			}
			else {
				nextTile = undefined;
			}
		}

		if (!nextTile) {
			const tryTwo = PacEntity.move(this.pixelPosition, this.facing);
			if ((this.facing === PacEntity.Direction.LEFT && tryTwo.x < 3) ||
				(this.facing === PacEntity.Direction.RIGHT && tryTwo.x > 3) ||
				(this.facing === PacEntity.Direction.UP && tryTwo.y < 4) ||
				(this.facing === PacEntity.Direction.DOWN && tryTwo.y > 4)) {
				nextTile = PacEntity.move(this.tilePosition, this.facing);
				const tileEnum = this.map.tiles[nextTile.y][nextTile.x];
				const canMove = this.canWalkOnTile(tileEnum);
				if (canMove) this.pixelPosition = tryTwo;
			}
			else {
				nextTile = this.tilePosition;
				this.pixelPosition = tryTwo;
			}
		}

		let adjust;
		if (this.facing === PacEntity.Direction.UP || this.facing === PacEntity.Direction.DOWN) {
			adjust = new vec2(Math.sign(3 - this.pixelPosition.x), 0);
		}
		else {
			adjust = new vec2(0, Math.sign(4 - this.pixelPosition.y));
		}
		if (adjust.x || adjust.y) this.pixelPosition = this.pixelPosition.add(adjust);

		// NOTE: Ensure pixel position is valid
		if (this.pixelPosition.x >= Map.PIXELS_PER_TILE || this.pixelPosition.x < 0 ||
			this.pixelPosition.y >= Map.PIXELS_PER_TILE || this.pixelPosition.y < 0) {
			this.tilePosition = nextTile;
			this.pixelPosition = this.pixelPosition.cmod(Map.PIXELS_PER_TILE);
		}

		return super.update(deltaTime);
	}

	protected canWalkOnTile(tile: MapTile): boolean {
		switch (tile) {
			case MapTile._PS:
			case MapTile._FS:
			case MapTile.GSB:
			case MapTile.GSP:
			case MapTile.GSI:
			case MapTile.GSC:

			case MapTile._p_:
			case MapTile._E_:

			case MapTile._s_:
			case MapTile.RU_:
			case MapTile.RR_:
			case MapTile.RUp:

			case MapTile.GTB:
			case MapTile.GTP:
			case MapTile.GTI:
			case MapTile.GTC:
				return true;
			default: return false;
		}
	}
}

// tslint:disable-next-line:no-namespace
namespace PacEntity {
	export enum Direction { RIGHT, LEFT, UP, DOWN }

	export function move(pos: vec2, direction: Direction): vec2 {
		switch (direction) {
			case Direction.RIGHT: return new vec2(pos.x + 1, pos.y + 0);
			case Direction.LEFT: return new vec2(pos.x - 1, pos.y + 0);
			case Direction.UP: return new vec2(pos.x + 0, pos.y - 1);
			case Direction.DOWN: return new vec2(pos.x + 0, pos.y + 1);
		}
	}

	export function isOpposite(d1: Direction, d2: Direction): boolean {
		switch (d1) {
			case Direction.RIGHT: return d2 === Direction.LEFT;
			case Direction.LEFT: return d2 === Direction.RIGHT;
			case Direction.UP: return d2 === Direction.DOWN;
			case Direction.DOWN: return d2 === Direction.UP;
			default: return false;
		}
	}

	/**
	 * Get which tile this entity is currently on. Tile (0, 0) is the upper left most tile
	 */
	export function getMapCoords(position: vec2): vec2 {
		return position.scale(1 / Map.PIXELS_PER_TILE).floor();
	}

	/**
	 * Get which pixel within a tile this entity is currently on. Pixel (0, 0) is the upper left most pixel within a tile
	 */
	export function getTileCoords(position: vec2): vec2 {
		const x = position.x % Map.PIXELS_PER_TILE;
		const y = position.y % Map.PIXELS_PER_TILE;
		return new vec2(x, y);
	}
}

export default PacEntity;
