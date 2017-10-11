import { Color } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle } from 'Engine/Model';
import { vec2 } from 'Engine/Math';

import { Pacman, Blinky, Pinky, Inky, Clyde, TargetTile, PelletEntity } from 'Pacman/Entity';
import MapTile from './MapTile';

export interface IStringMap<T> { [key: string]: T; }
export interface INumberMap<T> { [key: number]: T; }

const mapInfos: IStringMap<MapInitializer.IMapInfo> = { };

namespace MapInitializer {
	export interface IMapInfo {
		mapTexture: WebGLTexture;
		pellets: vec2[];
		energizers: vec2[];
	}

	export enum MapType {
		ORIGINAL = 'ORIGINAL',
	}

	export function getMapInfo(mapType: MapType): IMapInfo {
		if (mapInfos[mapType]) return mapInfos[mapType];
		const tiles = getMapTiles(mapType);
		const dimensions = new vec2(tiles[0].length, tiles.length);

		const mapTexture = buildMapTexture(tiles, dimensions);

		const info: IMapInfo = {
			mapTexture,
			energizers: null,
			pellets: null,
		};

		mapInfos[mapType] = info;
		return info;
	}

	function getMapTiles(mapType: MapType): MapTile[][] {
		return null;
	}

	function buildMapTexture(tiles: MapTile[][], dimensions: vec2): WebGLTexture {
		const textureData = [];
		for (let tileY = 0; tileY < dimensions.y; tileY++) {
			const tileRow = tiles[tileY];
			for (let pixelY = 0; pixelY < Map.PIXELS_PER_TILE; pixelY++) {
				for (let tileX = 0; tileX < dimensions.x; tileX++) {
					const tileEnum = tileRow[tileX];
					const color = getTileColor(tileEnum);
					const pixelInfo = MapTile.getPixelInfo(tileEnum);
					const pixelRow = pixelInfo[pixelY];

					for (let pixelX = Map.PIXELS_PER_TILE - 1; pixelX >= 0; pixelX--) {
						const pixel = isBitSet(pixelX, pixelRow);
						textureData.push.apply(textureData, pixel ? color : Map.COLOR.EMPTY.rgba);
					}
				}
			}
		}
		const data = new Uint8Array(textureData);
		const texture = WebGLHelpers.createTexture(null, data, dimensions);
		return texture;
	}

	function buildMapMetadata(tiles: MapTile[][], dimensions: vec2): void {
		const scatterTargets = { pacman: undefined, blinky: undefined, pinky: undefined, inky: undefined, clyde: undefined };
		const startingTiles = { pacman: undefined, blinky: undefined, pinky: undefined, inky: undefined, clyde: undefined };
		const basicTileInfo = [];
		const pellets = [];
		const energizers = [];
		for (let tileY = 0; tileY < dimensions.y; tileY++) {
			const tileRow = tiles[tileY];
			const basicRowInfo = [];
			basicTileInfo.push(basicRowInfo);
			for (let tileX = 0; tileX < dimensions.x; tileX++) {
				const tileEnum = tileRow[tileX];
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

					case MapTile._p_: case MapTile.RUp: pellets.push(new vec2(tileX, tileY)); break;
					case MapTile._E_: energizers.push(new vec2(tileX, tileY)); break;
				}
			}
		}
	}
}

export default MapInitializer;

export namespace WebGLHelpers {
	export function createTexture(gl: WebGLRenderingContext, data: Uint8Array, dimensions: vec2): WebGLTexture {
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
}

namespace Map {
	export const PIXELS_PER_TILE = 8;
	export const DISPLAY_TARGET_TILE = false;

	export enum BasicTileInfo {
		BLOCK = 'BLOCK',
		OPEN = 'OPEN',
		SLOW = 'SLOW',
		RESTRICTED_UP = 'RESTRICTED_UP',
		GHOST_PEN = 'GHOST_PEN',
	}

	export const COLOR = {
		BORDER: new Color(0x21, 0x21, 0xFF, 0xFF),
		GATE: new Color(0xFF, 0xB8, 0xFF, 0xFF),
		EMPTY: new Color(0x00, 0x00, 0x00, 0xFF),
		PELLET: new Color(0xFF, 0xB5, 0x94, 0xFF),
		PACMAN: new Color(0xFF, 0xCC, 0x00, 0xFF),
		BLINKY: new Color(0xFF, 0x00, 0x00, 0xFF),
		PINKY: new Color(0xFF, 0x9C, 0xCE, 0xFF),
		INKY: new Color(0x31, 0xFF, 0xFF, 0xFF),
		CLYDE: new Color(0xFF, 0xCE, 0x31, 0xFF),
	};
}

interface IEntityPositions {
	pacman: vec2;
	blinky: vec2;
	pinky: vec2;
	inky: vec2;
	clyde: vec2;
}

interface IMapMetaData {
	staticContentTextureData: Uint8Array;
	startingTiles: IEntityPositions;
	scatterTargets: IEntityPositions;
	basicTileInfo: Map.BasicTileInfo[][];
	pellets: vec2[];
	energizers: vec2[];
}

function initialize(gl: WebGLRenderingContext): void {
	this.metadata = parseMapInfo(this.tiles); this.tiles = undefined;
	const texture = createTexture(gl, this.metadata.staticContentTextureData, this.pixelDimensions);

	const mapModel = new SimpleTextureRectangle(texture);
	const worldEntity = new Entity(mapModel, this.pixelDimensions.scale(0.5).toVec3(), this.pixelDimensions.toVec3(1));
	worldEntity.setParent(this);

	this.pellets = new PelletEntity(this.metadata.pellets);
	this.pellets.setParent(this);

	this.energizers = new PelletEntity(this.metadata.energizers, 6, true);
	this.energizers.setParent(this);

	const startingTiles = this.metadata.startingTiles;
	this.pacman = new Pacman(startingTiles.pacman);
	const blinky = new Blinky(startingTiles.blinky, this.pacman);
	const pinky = new Pinky(startingTiles.pinky, this.pacman);
	const inky = new Inky(startingTiles.inky, this.pacman, blinky);
	const clyde = new Clyde(startingTiles.clyde, this.pacman);

	this.pacman.setParent(this);
	blinky.setParent(this);
	pinky.setParent(this);
	inky.setParent(this);
	clyde.setParent(this);

	if (Map.DISPLAY_TARGET_TILE) {
		new TargetTile(Map.COLOR.BLINKY.normalize(), blinky).setParent(this);
		new TargetTile(Map.COLOR.PINKY.normalize(), pinky).setParent(this);
		new TargetTile(Map.COLOR.INKY.normalize(), inky).setParent(this);
		new TargetTile(Map.COLOR.CLYDE.normalize(), clyde).setParent(this);
	}

	this.reset();
}

function getBasicTileInfo(tile: MapTile): Map.BasicTileInfo {
	switch (tile) {
		case MapTile._PS:
		case MapTile._FS:
		case MapTile.GSB:
		case MapTile._p_:
		case MapTile._E_:
		case MapTile.___: return Map.BasicTileInfo.OPEN;

		case MapTile._s_: return Map.BasicTileInfo.SLOW;

		case MapTile.RUp:
		case MapTile.RU_: return Map.BasicTileInfo.RESTRICTED_UP;

		case MapTile.GSP:
		case MapTile.GSI:
		case MapTile.GSC:
		case MapTile.GGG: case MapTile.GP_: return Map.BasicTileInfo.GHOST_PEN;

		default: return Map.BasicTileInfo.BLOCK;
	}
}

function getTileColor(tile: MapTile): number[] {
	switch (tile) {
		case MapTile.___: return Map.COLOR.EMPTY.rgba;
		case MapTile.RUp: case MapTile._p_: case MapTile._E_: return Map.COLOR.PELLET.rgba;
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
