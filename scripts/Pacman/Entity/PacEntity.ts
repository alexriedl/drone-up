import { MT, Map, OriginalMap } from 'Pacman/Map';

import { Color } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle, SimpleRectangle } from 'Engine/Model';
import { vec2, vec3 } from 'Engine/Math';

export default class PacEntity extends Entity {
	private facing: vec2;

	public position: vec3;
	public scale: vec3;

	public map: Map;

	// TODO: Map should not need to be passed into entity
	public constructor(map: Map, startTile: vec2, size: vec2 = new vec2(16, 16)) {
		super(new SimpleRectangle(Color.YELLOW));

		// TODO: Conversion between tiles and pixels in entity is strange...
		this.position = new vec3((startTile.x + 0.5) * Map.PIXELS_PER_TILE, (startTile.y + 0.5) * Map.PIXELS_PER_TILE);
		this.scale = size.toVec3(1);
		this.facing = new vec2(0, 1);
		this.map = map;
	}

	public get currentTile(): vec2 {
		return new vec2();
	}

	public get currentPixel(): vec2 {
		return new vec2();
	}

	/**
	 * Get which tile this entity is currently on. Tile (0, 0) is the upper left most tile
	 */
	public getMapCoords(): vec2 {
		return PacEntity.getMapCoords(vec2.fromArray(this.position.xy));
	}

	/**
	 * Get which pixel within a tile this entity is currently on. Pixel (0, 0) is the upper left most pixel within a tile
	 */
	public getTileCoords(): vec2 {
		return PacEntity.getTileCoords(vec2.fromArray(this.position.xy));
	}

	public getNextTile(): MT {
		const coords = this.getMapCoords().add(this.facing);
		return this.map.tiles[coords.y][coords.x];
	}

	public update(deltaTime: number): boolean {
		deltaTime /= 5;
		const newPos = this.position.addValues(this.facing.x * deltaTime, this.facing.y * deltaTime, 0);
		const newMapPos = PacEntity.getMapCoords(vec2.fromArray(newPos.xy));
		const tile = this.map.tiles[newMapPos.y][newMapPos.x];
		const canMove = this.canWalkOnTile(tile);
		if (canMove) this.position = newPos;
		else this.facing = PacEntity.randomDirection();

		return super.update(deltaTime);
	}

	protected canWalkOnTile(tile: MT): boolean {
		switch (tile) {
			case MT._PS:
			case MT._FS:
			case MT.GSB:
			case MT.GSP:
			case MT.GSI:
			case MT.GSC:

			case MT._p_:
			case MT._E_:

			case MT._s_:
			case MT.RU_:
			case MT.RR_:
			case MT.RUp:

			case MT.GTB:
			case MT.GTP:
			case MT.GTI:
			case MT.GTC:
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
