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

export abstract class Map extends Entity {
	public readonly numXTiles: number;
	public readonly numYTiles: number;

	public readonly dimensions: vec2;

	// TODO: Tiles should not be public
	public tiles: MapTile[][];

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
		this.numXTiles = numXTiles;
		this.numYTiles = numYTiles;
		this.dimensions = new vec2(width, height);
	}

	public initialize(gl: WebGLRenderingContext): void {
		const metadata = Map.parseMapInfo(this.tiles);
		const texture = Map.generateLevelTexture(gl, metadata.staticContentTextureData, this.dimensions);
		this.model = new SimpleTextureRectangle(texture);
		this.startingPositions = metadata.startingPositions;
	}
}

// tslint:disable-next-line:no-namespace
export namespace Map {
	export function parseMapInfo(tiles: MapTile[][]): IMapMetaData {
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
					const color = Map.getTileColor(tileEnum);
					const pixelInfo = Map.getTilePixelInfo(tileEnum);
					const pixelRow = pixelInfo[pixelY];
					switch (tileEnum) {
						case MapTile._PS: startingPositions.pacman = new vec2(tileX, tileY);
						case MapTile.GSB: startingPositions.blinky = new vec2(tileX, tileY);
						case MapTile.GSP: startingPositions.pinky = new vec2(tileX, tileY);
						case MapTile.GSI: startingPositions.inky = new vec2(tileX, tileY);
						case MapTile.GSC: startingPositions.clyde = new vec2(tileX, tileY);
					}

					for (let pixelX = Map.PIXELS_PER_TILE - 1; pixelX >= 0; pixelX--) {
						const pixel = Map.isBitSet(pixelX, pixelRow);
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

	export function generateLevelTexture(gl: WebGLRenderingContext, data: Uint8Array,
		dimensions: vec2): WebGLTexture {
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

	// NOTE: This is a constant. If this needs to change, all of the hand drawn
	// tiles would need to be updated
	export const PIXELS_PER_TILE = 8;

	export const COLOR = {
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

	export function getTileColor(tile: MapTile): number[] {
		switch (tile) {
			case MapTile.___: return COLOR.EMPTY;
			case MapTile.RUp: case MapTile._p_: case MapTile._E_: return COLOR.PAC;
			case MapTile.GGG: return COLOR.GATE;
			case MapTile._PS: return COLOR.PACMAN;
			case MapTile.GSB: case MapTile.GTB: return COLOR.BLINKY;
			case MapTile.GSP: case MapTile.GTP: return COLOR.PINKY;
			case MapTile.GSI: case MapTile.GTI: return COLOR.INKY;
			case MapTile.GSC: case MapTile.GTC: return COLOR.CLYDE;
			default: return COLOR.BORDER;
		}
	}

	/**
	 * Use a bit mask to check if a bit is on or off. Specify which bit to check, and
	 * which value to look at.
	 */
	export function isBitSet(bit: number, value: number): boolean {
		// tslint:disable-next-line:no-bitwise
		return !!(value & (1 << bit));
	}

	/**
	 * For a given tile, generate an array to indicate which pixels are lite up.
	 *
	 * Returns an array of ints. Each element in the array is a row of pixels in the
	 * tile. Each bit in each element indicates which pixels are lite. Bit 0, is x
	 * 0.
	 */
	export function getTilePixelInfo(tile: MapTile): number[] {
		switch (tile) {
			case MapTile.DNW: return [0x07, 0x18, 0x20, 0x47, 0x48, 0x90, 0x90, 0x90];
			case MapTile.DNE: return [0xE0, 0x18, 0x04, 0xE2, 0x12, 0x09, 0x09, 0x09];
			case MapTile.DSW: return [0x90, 0x90, 0x90, 0x48, 0x47, 0x20, 0x18, 0x07];
			case MapTile.DSE: return [0x09, 0x09, 0x09, 0x12, 0xE2, 0x04, 0x18, 0xE0];

			case MapTile.DN_: return [0xFF, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00];
			case MapTile.DS_: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xFF];
			case MapTile.DE_: return [0x09, 0x09, 0x09, 0x09, 0x09, 0x09, 0x09, 0x09];
			case MapTile.DW_: return [0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90];

			case MapTile.SN_: return [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00];
			case MapTile.SS_: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00];
			case MapTile.SE_: return [0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08];
			case MapTile.SW_: return [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10];

			case MapTile.SNW: return [0x10, 0x10, 0x20, 0xC0, 0x00, 0x00, 0x00, 0x00];
			case MapTile.SNE: return [0x08, 0x08, 0x04, 0x03, 0x00, 0x00, 0x00, 0x00];
			case MapTile.SSW: return [0x00, 0x00, 0x00, 0x00, 0xC0, 0x20, 0x10, 0x10];
			case MapTile.SSE: return [0x00, 0x00, 0x00, 0x00, 0x03, 0x04, 0x08, 0x08];

			case MapTile.PEE: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x80, 0x80, 0xFF];
			case MapTile.PEW: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x01, 0x01, 0xFF];
			case MapTile.GGG: return [0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00];

			case MapTile.PNW: return [0x90, 0x10, 0x10, 0xF0, 0x00, 0x00, 0x00, 0x00];
			case MapTile.PNE: return [0x09, 0x08, 0x08, 0x0F, 0x00, 0x00, 0x00, 0x00];
			case MapTile.PSW: return [0x00, 0x00, 0x00, 0x00, 0xF0, 0x10, 0x10, 0x90];
			case MapTile.PSE: return [0x00, 0x00, 0x00, 0x00, 0x0F, 0x08, 0x08, 0x09];

			case MapTile.INW: return [0x00, 0x00, 0x00, 0x07, 0x08, 0x10, 0x10, 0x10];
			case MapTile.INE: return [0x00, 0x00, 0x00, 0xE0, 0x10, 0x08, 0x08, 0x08];
			case MapTile.ISW: return [0x10, 0x10, 0x10, 0x08, 0x07, 0x00, 0x00, 0x00];
			case MapTile.ISE: return [0x08, 0x08, 0x08, 0x10, 0xE0, 0x00, 0x00, 0x00];

			case MapTile.NNW: return [0xFF, 0x00, 0x00, 0x07, 0x08, 0x10, 0x10, 0x10];
			case MapTile.NNE: return [0xFF, 0x00, 0x00, 0xE0, 0x10, 0x08, 0x08, 0x08];
			case MapTile.ENE: return [0x01, 0x01, 0x01, 0xE1, 0x11, 0x09, 0x09, 0x09];
			case MapTile.ESE: return [0x09, 0x09, 0x09, 0x11, 0xE1, 0x01, 0x01, 0x01];
			case MapTile.WNW: return [0x80, 0x80, 0x80, 0x87, 0x88, 0x90, 0x90, 0x90];
			case MapTile.WSW: return [0x90, 0x90, 0x90, 0x88, 0x87, 0x80, 0x80, 0x80];

			case MapTile.RUp:
			case MapTile._p_: return [0x00, 0x00, 0x00, 0x18, 0x18, 0x00, 0x00, 0x00];
			case MapTile._E_: return [0x3C, 0x7E, 0xFF, 0xFF, 0xFF, 0xFF, 0x7E, 0x3C];

			case MapTile._PS:
			case MapTile.GSB:
			case MapTile.GSP:
			case MapTile.GSI:
			case MapTile.GSC:
				return [0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00];

			case MapTile.GTB: case MapTile.GTP: case MapTile.GTI: case MapTile.GTC:
			case MapTile.FFF: return [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
			default:
			case MapTile.___: return [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
		}
	}
}

export default Map;
