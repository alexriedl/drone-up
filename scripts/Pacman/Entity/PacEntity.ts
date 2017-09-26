import { MapTile, Map, OriginalMap } from 'Pacman/Map';

import { Color, Random } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle, SimpleRectangle } from 'Engine/Model';
import { vec2, vec3 } from 'Engine/Math';

class PacEntity extends Entity {
	private facing: PacEntity.Direction;
	private tilePosition: vec2;
	private pixelPosition: vec2;

	private randomizer: Random;
	public map: Map;

	// TODO: Map should not need to be passed into entity
	public constructor(startTile: vec2, facingDirection: PacEntity.Direction, map: Map, randomizer: Random) {
		super(new SimpleRectangle(Color.YELLOW));

		// TODO: Conversion between tiles and pixels in entity is strange...
		this.tilePosition = startTile;
		this.pixelPosition = new vec2(Map.PIXELS_PER_TILE - 0.5, Map.PIXELS_PER_TILE / 2);
		this.scale = new vec3(16, 16, 1);
		this.facing = facingDirection;
		this.map = map;
		this.randomizer = randomizer;
	}

	public get position(): vec3 {
		const p = this.tilePosition;
		const ps = p.scale(Map.PIXELS_PER_TILE);
		const psa = ps.add(this.pixelPosition);
		const psa3 = psa.toVec3(0);
		return psa3;

		// return this.tilePosition.scale(Map.PIXELS_PER_TILE).add(this.pixelPosition).toVec3(0);
	}
	public set position(value: vec3) {
		console.log("Ignoring direct set of PacEntity's position value");
	}

	// TODO: Perhaps limit max deltaTime to be a reasonable value to avoid some strange large frame problems
	public update(deltaTime: number): boolean {

		const t = true;
		if (t) return t;

		// TODO: Build a speed into the update based on deltaTime
		// TODO: Does multiple updates per frame need to be supported?
		// If based on the speed this entity wants to move more than one pixel, put this logic in a loop.
		// Iterate over all update logic so no entity moves multiple pixels per update and clips through
		// walls or causes other issues
		const nextTile = PacEntity.move(this.tilePosition, this.facing); // this.tilePosition.add(this.facing);
		const tileEnum = this.map.tiles[nextTile.y][nextTile.x];
		const canMove = this.canWalkOnTile(tileEnum);

		if (canMove) {
			this.pixelPosition = PacEntity.move(this.pixelPosition, this.facing);
			// NOTE: Ensure pixel position is valid
			if (this.pixelPosition.x >= Map.PIXELS_PER_TILE || this.pixelPosition.x < 0 ||
				this.pixelPosition.y >= Map.PIXELS_PER_TILE || this.pixelPosition.y < 0) {
				this.tilePosition = nextTile;
				this.pixelPosition = this.pixelPosition.mod(Map.PIXELS_PER_TILE);
			}
		}
		else this.facing = PacEntity.randomDirection(this.randomizer);

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
			case Direction.UP: return new vec2(pos.x + 0, pos.y + 1);
			case Direction.DOWN: return new vec2(pos.x + 0, pos.y + 1);
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

	export function randomDirection(randomizer: Random): PacEntity.Direction {
		switch (randomizer.nextRangeInt(0, 4)) {
			case 0: return PacEntity.Direction.RIGHT;
			case 1: return PacEntity.Direction.LEFT;
			case 2: return PacEntity.Direction.UP;
			case 3: return PacEntity.Direction.DOWN;
		}
	}
}

export default PacEntity;
