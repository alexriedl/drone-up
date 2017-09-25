import { MapTile, Map, OriginalMap } from 'Pacman/Map';

import { Color } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle, SimpleRectangle } from 'Engine/Model';
import { vec2, vec3 } from 'Engine/Math';

export enum Direction { RIGHT, LEFT, UP, DOWN }
vec2.prototype.add = function(this: vec2, other: vec2 | Direction): vec2 {
	if (other instanceof vec2) return new vec2(this.x + other.x, this.y + other.y);

	switch (other) {
		case Direction.RIGHT: return new vec2(this.x + 1, this.y + 0);
		case Direction.LEFT: return new vec2(this.x - 1, this.y + 0);
		case Direction.UP: return new vec2(this.x + 0, this.y + 1);
		case Direction.DOWN: return new vec2(this.x + 0, this.y + 1);
	}
};

export default class PacEntity extends Entity {
	private facing: Direction;
	private tilePosition: vec2;
	private pixelPosition: vec2;

	public map: Map;

	// TODO: Map should not need to be passed into entity
	public constructor(map: Map, startTile: vec2, facingDirection: Direction) {
		super(new SimpleRectangle(Color.YELLOW));

		// TODO: Conversion between tiles and pixels in entity is strange...
		this.tilePosition = startTile;
		this.pixelPosition = new vec2(Map.PIXELS_PER_TILE, Map.PIXELS_PER_TILE);
		this.scale = new vec3(16, 16, 1);
		this.facing = facingDirection;
		this.map = map;
	}

	public get position(): vec3 {
		return this.tilePosition.scale(Map.PIXELS_PER_TILE).add(this.pixelPosition).toVec3(1);
	}

	// TODO: Perhaps limit max deltaTime to be a reasonable value to avoid some strange large frame problems
	public update(deltaTime: number): boolean {
		// TODO: Build a speed into the update based on deltaTime
		// TODO: Does multiple updates per frame need to be supported?
		// If based on the speed this entity wants to move more than one pixel, put this logic in a loop.
		// Iterate over all update logic so no entity moves multiple pixels per update and clips through
		// walls or causes other issues
		const nextTile = this.tilePosition.add(this.facing);
		const tileEnum = this.map.tiles[nextTile.y][nextTile.x];
		const canMove = this.canWalkOnTile(tileEnum);

		if (canMove) {
			this.pixelPosition = this.pixelPosition.add(this.facing);
			// NOTE: Ensure pixel position is valid
			if (this.pixelPosition.x >= Map.PIXELS_PER_TILE || this.pixelPosition.x < 0 ||
				this.pixelPosition.y >= Map.PIXELS_PER_TILE || this.pixelPosition.y < 0) {
				this.tilePosition = this.tilePosition.add(this.facing);
				this.pixelPosition = this.pixelPosition.mod(Map.PIXELS_PER_TILE);
			}
		}
		else this.facing = PacEntity.randomDirection();

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

	/**
	 * Get which tile this entity is currently on. Tile (0, 0) is the upper left most tile
	 */
	public static getMapCoords(position: vec2): vec2 {
		return position.scale(1 / Map.PIXELS_PER_TILE).floor();
	}

	/**
	 * Get which pixel within a tile this entity is currently on. Pixel (0, 0) is the upper left most pixel within a tile
	 */
	public static getTileCoords(position: vec2): vec2 {
		const x = position.x % Map.PIXELS_PER_TILE;
		const y = position.y % Map.PIXELS_PER_TILE;
		return new vec2(x, y);
	}

	public static randomDirection(): vec2 {
		switch (Math.floor(Math.random() * 4)) {
			case 0: return new vec2(0, +1);
			case 1: return new vec2(0, -1);
			case 2: return new vec2(+1, 0);
			case 3: return new vec2(-1, 0);
			default: console.log('Unknown direction!!!');
		}
	}
}
