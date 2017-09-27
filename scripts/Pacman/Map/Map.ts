import { Color } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { Model, SimpleTextureRectangle } from 'Engine/Model';
import { vec2, vec3 } from 'Engine/Math';

import MapTile from './MapTile';

interface IMapMetaData {
	staticContentTextureData: Uint8Array;
	startingPositions: IStartingPosition;
}

export interface IStartingPosition {
	pacman: vec2;
	blinky: vec2;
	pinky: vec2;
	inky: vec2;
	clyde: vec2;
}

export default abstract class Map extends Entity {
	// NOTE: This is a constant. If this needs to change, all of the hand drawn
	// tiles would need to be updated
	public static readonly PIXELS_PER_TILE = 8;
	public static readonly COLOR = {
		BORDER: new Color(0x21, 0x21, 0xFF, 0xFF).rgba,
		GATE: new Color(0xFF, 0xB8, 0xFF, 0xFF).rgba,
		EMPTY: new Color(0x00, 0x00, 0x00, 0xFF).rgba,
		PAC: new Color(0xFF, 0xDE, 0xD2, 0xFF).rgba,
		PACMAN: new Color(0xFF, 0xCC, 0x00, 0xFF).rgba,
		BLINKY: new Color(0xFF, 0x00, 0x00, 0xFF).rgba,
		PINKY: new Color(0xFF, 0xB8, 0xFF, 0xFF).rgba,
		INKY: new Color(0x00, 0xFF, 0xFF, 0xFF).rgba,
		CLYDE: new Color(0xFF, 0xB8, 0x51, 0xFF).rgba,
	};

	public readonly pixelDimensions: vec2;
	public readonly tileDimensions: vec2;

	private tiles: MapTile[][];

	public startingPositions: IStartingPosition;

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
		const metadata = parseMapInfo(this.tiles);
		const texture = generateLevelTexture(gl, metadata.staticContentTextureData, this.pixelDimensions);
		this.model = new SimpleTextureRectangle(texture);
		this.startingPositions = metadata.startingPositions;
	}

	public canMoveToTile(coords: vec2): boolean {
		if (coords.x < 0 || coords.x >= this.tileDimensions.x
			|| coords.y < 0 || coords.y >= this.tileDimensions.y) return true;
		const tile = this.tiles[coords.y][coords.x];
		return canWalkOnTile(tile);
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

function canWalkOnTile(tile: MapTile): boolean {
	switch (tile) {
		case MapTile._PS:
		case MapTile._FS:
		case MapTile.GSB:
		case MapTile.GSP:
		case MapTile.GSI:
		case MapTile.GSC:

		case MapTile.___:
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

function parseMapInfo(tiles: MapTile[][]): IMapMetaData {
	const numYTiles = tiles.length;
	const numXTiles = tiles[0].length;
	const textureData = [];
	const startingPositions = {
		pacman: undefined,
		blinky: undefined,
		pinky: undefined,
		inky: undefined,
		clyde: undefined,
	};
	for (let tileY = 0; tileY < numYTiles; tileY++) {
		const tileRow = tiles[tileY];
		for (let pixelY = 0; pixelY < Map.PIXELS_PER_TILE; pixelY++) {
			for (let tileX = 0; tileX < numXTiles; tileX++) {
				const tileEnum = tileRow[tileX];
				const color = getTileColor(tileEnum);
				const pixelInfo = MapTile.getPixelInfo(tileEnum);
				const pixelRow = pixelInfo[pixelY];
				switch (tileEnum) {
					case MapTile._PS: startingPositions.pacman = new vec2(tileX, tileY);
					case MapTile.GSB: startingPositions.blinky = new vec2(tileX, tileY);
					case MapTile.GSP: startingPositions.pinky = new vec2(tileX, tileY);
					case MapTile.GSI: startingPositions.inky = new vec2(tileX, tileY);
					case MapTile.GSC: startingPositions.clyde = new vec2(tileX, tileY);
				}

				for (let pixelX = Map.PIXELS_PER_TILE - 1; pixelX >= 0; pixelX--) {
					const pixel = isBitSet(pixelX, pixelRow);
					textureData.push.apply(textureData, pixel ? color : Map.COLOR.EMPTY);
				}
			}
		}
	}

	return {
		staticContentTextureData: new Uint8Array(textureData),
		startingPositions,
	};
}

function generateLevelTexture(gl: WebGLRenderingContext, data: Uint8Array, dimensions: vec2): WebGLTexture {
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
		case MapTile.___: return Map.COLOR.EMPTY;
		case MapTile.RUp: case MapTile._p_: case MapTile._E_: return Map.COLOR.PAC;
		case MapTile.GGG: return Map.COLOR.GATE;
		case MapTile._PS: return Map.COLOR.PACMAN;
		case MapTile.GSB: case MapTile.GTB: return Map.COLOR.BLINKY;
		case MapTile.GSP: case MapTile.GTP: return Map.COLOR.PINKY;
		case MapTile.GSI: case MapTile.GTI: return Map.COLOR.INKY;
		case MapTile.GSC: case MapTile.GTC: return Map.COLOR.CLYDE;
		default: return Map.COLOR.BORDER;
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
