import { Color } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle } from 'Engine/Model';
import { vec2, vec3 } from 'Engine/Math';

import { Direction } from 'Pacman/Utils';
import MapTile from './MapTile';

interface IMapMetaData {
	staticContentTextureData: Uint8Array;
	startingTiles: IEntityPositions;
	scatterTargets: IEntityPositions;
	basicTileInfo: Map.BasicTileInfo[][];
}

interface IEntityPositions {
	pacman: vec2;
	blinky: vec2;
	pinky: vec2;
	inky: vec2;
	clyde: vec2;
}

abstract class Map extends Entity {
	// NOTE: This is a constant. If this needs to change, all of the hand drawn
	// tiles would need to be updated
	public static readonly PIXELS_PER_TILE = 8;
	public static readonly COLOR = {
		BORDER: new Color(0x21, 0x21, 0xFF, 0xFF),
		GATE: new Color(0xFF, 0xB8, 0xFF, 0xFF),
		EMPTY: new Color(0x00, 0x00, 0x00, 0xFF),
		PAC: new Color(0xFF, 0xDE, 0xD2, 0xFF),
		PACMAN: new Color(0xFF, 0xCC, 0x00, 0xFF),
		BLINKY: new Color(0xFF, 0x00, 0x00, 0xFF),
		PINKY: new Color(0xFF, 0xB8, 0xFF, 0xFF),
		INKY: new Color(0x00, 0xFF, 0xFF, 0xFF),
		CLYDE: new Color(0xFF, 0xB8, 0x51, 0xFF),
	};

	public readonly pixelDimensions: vec2;
	public readonly tileDimensions: vec2;

	public metadata: IMapMetaData;

	/**
	 * Do not use this value. After the map is initialized, this is blown away
	 */
	private tiles: MapTile[][];

	public constructor(tiles: MapTile[][]) {
		const numXTiles = tiles[0].length;
		const numYTiles = tiles.length;
		const width = numXTiles * Map.PIXELS_PER_TILE;
		const height = numYTiles * Map.PIXELS_PER_TILE;

		super(undefined,
			new vec3(width / 2, height / 2),
			new vec3(width, height, 1));

		this.tiles = tiles;
		this.pixelDimensions = new vec2(width, height);
		this.tileDimensions = new vec2(numXTiles, numYTiles);
	}

	public initialize(gl: WebGLRenderingContext): void {
		this.metadata = parseMapInfo(this.tiles); this.tiles = undefined;
		const texture = createTexture(gl, this.metadata.staticContentTextureData, this.pixelDimensions);
		this.model = new SimpleTextureRectangle(texture);
	}

	public canMoveToTile(coords: vec2, direction?: Direction): boolean {
		if (coords.x < 0 || coords.x >= this.tileDimensions.x
			|| coords.y < 0 || coords.y >= this.tileDimensions.y) return true;

		switch (this.getTileInfo(coords)) {
			case Map.BasicTileInfo.GHOST_PEN:
			case Map.BasicTileInfo.BLOCK: return false;
			case Map.BasicTileInfo.OPEN: return true;
			case Map.BasicTileInfo.RESTRICTED_UP: return !direction || direction !== Direction.UP;
		}
	}

	public getTileInfo(coords: vec2): Map.BasicTileInfo {
		if (coords.x < 0 || coords.x >= this.tileDimensions.x
			|| coords.y < 0 || coords.y >= this.tileDimensions.y) return undefined;
		return this.metadata.basicTileInfo[coords.y][coords.x];
	}

	/**
		* Wrap coords to other side of board if they are off of the edge. NOTE: This logic will snap the
		* coords to the last tile within the map
	 */
	public orientCoords(tileCoords: vec2): vec2 {
		let x = tileCoords.x;
		let y = tileCoords.y;

		if (x >= this.tileDimensions.x) x = 0;
		else if (x < 0) x = this.tileDimensions.x - 1;

		if (y >= this.tileDimensions.y) y = 0;
		else if (y < 0) y = this.tileDimensions.y - 1;

		return new vec2(x, y);
	}
}

namespace Map {
	export enum BasicTileInfo {
		BLOCK = 'BLOCK',
		OPEN = 'OPEN',
		RESTRICTED_UP = 'RESTRICTED_UP',
		GHOST_PEN = 'GHOST_PEN',
	}
}

function getBasicTileInfo(tile: MapTile): Map.BasicTileInfo {
	switch (tile) {
		case MapTile._PS:
		case MapTile._FS:
		case MapTile.GSB:
		case MapTile._s_:
		case MapTile.___:
		case MapTile._p_:
		case MapTile._E_:
			return Map.BasicTileInfo.OPEN;

		case MapTile.RUp:
		case MapTile.RU_: return Map.BasicTileInfo.RESTRICTED_UP;

		case MapTile.GSP:
		case MapTile.GSI:
		case MapTile.GSC:
		case MapTile.GGG: case MapTile.GP_: return Map.BasicTileInfo.GHOST_PEN;

		default: return Map.BasicTileInfo.BLOCK;
	}
}

function parseMapInfo(tiles: MapTile[][]): IMapMetaData {
	const numYTiles = tiles.length;
	const numXTiles = tiles[0].length;
	const textureData = [];
	const scatterTargets = { pacman: undefined, blinky: undefined, pinky: undefined, inky: undefined, clyde: undefined };
	const startingTiles = { pacman: undefined, blinky: undefined, pinky: undefined, inky: undefined, clyde: undefined };
	const basicTileInfo = [];
	for (let tileY = 0; tileY < numYTiles; tileY++) {
		const tileRow = tiles[tileY];
		const basicRowInfo = [];
		basicTileInfo.push(basicRowInfo);
		for (let pixelY = 0; pixelY < Map.PIXELS_PER_TILE; pixelY++) {
			for (let tileX = 0; tileX < numXTiles; tileX++) {
				const tileEnum = tileRow[tileX];
				const color = getTileColor(tileEnum);
				const pixelInfo = MapTile.getPixelInfo(tileEnum);
				const pixelRow = pixelInfo[pixelY];
				basicRowInfo.push(getBasicTileInfo(tileEnum));
				switch (tileEnum) {
					case MapTile._PS: startingTiles.pacman = new vec2(tileX, tileY); break;
					case MapTile.GSB: startingTiles.blinky = new vec2(tileX, tileY); break;
					case MapTile.GSP: startingTiles.pinky = new vec2(tileX, tileY); break;
					case MapTile.GSI: startingTiles.inky = new vec2(tileX, tileY); break;
					case MapTile.GSC: startingTiles.clyde = new vec2(tileX, tileY); break;

					case MapTile.GTB: scatterTargets.blinky = new vec2(tileX, tileY); break;
					case MapTile.GTP: scatterTargets.pinky = new vec2(tileX, tileY); break;
					case MapTile.GTI: scatterTargets.inky = new vec2(tileX, tileY); break;
					case MapTile.GTC: scatterTargets.clyde = new vec2(tileX, tileY); break;
				}

				for (let pixelX = Map.PIXELS_PER_TILE - 1; pixelX >= 0; pixelX--) {
					const pixel = isBitSet(pixelX, pixelRow);
					textureData.push.apply(textureData, pixel ? color : Map.COLOR.EMPTY.rgba);
				}
			}
		}
	}

	return {
		staticContentTextureData: new Uint8Array(textureData),
		startingTiles,
		scatterTargets,
		basicTileInfo,
	};
}

// TODO: Move this function to a more general spot
function createTexture(gl: WebGLRenderingContext, data: Uint8Array, dimensions: vec2): WebGLTexture {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, dimensions.x, dimensions.y, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	gl.bindTexture(gl.TEXTURE_2D, null);
	return texture;
}

function getTileColor(tile: MapTile): number[] {
	switch (tile) {
		case MapTile.___: return Map.COLOR.EMPTY.rgba;
		case MapTile.RUp: case MapTile._p_: case MapTile._E_: return Map.COLOR.PAC.rgba;
		case MapTile.GGG: return Map.COLOR.GATE.rgba;
		case MapTile._PS: return Map.COLOR.PACMAN.rgba;
		case MapTile.GSB: case MapTile.GTB: return Map.COLOR.BLINKY.rgba;
		case MapTile.GSP: case MapTile.GTP: return Map.COLOR.PINKY.rgba;
		case MapTile.GSI: case MapTile.GTI: return Map.COLOR.INKY.rgba;
		case MapTile.GSC: case MapTile.GTC: return Map.COLOR.CLYDE.rgba;
		default: return Map.COLOR.BORDER.rgba;
	}
}

/**
 * Use a bit mask to check if a bit is on or off. Specify which bit to check, and
 * which value to look at.
 */
function isBitSet(bit: number, value: number): boolean {
	// tslint:disable-next-line:no-bitwise
	return !!(value & (1 << bit));
}

export default Map;
