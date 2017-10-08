import { Color } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle } from 'Engine/Model';
import { vec2 } from 'Engine/Math';

import { Direction } from 'Pacman/Utils';
import { PacEntity, GhostEntity, Pacman, Blinky, Pinky, Inky, Clyde, TargetTile, PelletEntity } from 'Pacman/Entity';
import MapTile from './MapTile';

interface IMapMetaData {
	staticContentTextureData: Uint8Array;
	startingTiles: IEntityPositions;
	scatterTargets: IEntityPositions;
	basicTileInfo: Map.BasicTileInfo[][];
	pellets: vec2[];
	energizers: vec2[];
}

interface IEntityPositions {
	pacman: vec2;
	blinky: vec2;
	pinky: vec2;
	inky: vec2;
	clyde: vec2;
}

interface IGhostModeInfo {
	currentGhostMode: GhostEntity.GhostMode;
	ghostModeDuration: number;
	swaps: number;
}

interface IPlayerDeadState {
	deadPauseTimer: number;
}

abstract class Map extends Entity {
	// NOTE: This is a constant. If this needs to change, all of the hand drawn
	// tiles would need to be updated
	public static readonly PIXELS_PER_TILE = 8;
	public static readonly COLOR = {
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
	public static readonly DISPLAY_TARGET_TILE = false;

	public readonly pixelDimensions: vec2;
	public readonly tileDimensions: vec2;

	private ghostModeInfo: IGhostModeInfo;
	private static readonly ghostModeDuration: number = 60 * 7; // 60fps = 7 seconds

	public metadata: IMapMetaData;
	private playerDeadState: IPlayerDeadState;
	private pellets: PelletEntity;
	private energizers: PelletEntity;
	private pacman: Pacman;

	private introTime: number;

	/**
	 * Do not use this value. After the map is initialized, this is blown away
	 */
	private tiles: MapTile[][];

	public constructor(tiles: MapTile[][]) {
		super();

		const numXTiles = tiles[0].length;
		const numYTiles = tiles.length;
		const width = numXTiles * Map.PIXELS_PER_TILE;
		const height = numYTiles * Map.PIXELS_PER_TILE;

		this.tiles = tiles;
		this.pixelDimensions = new vec2(width, height);
		this.tileDimensions = new vec2(numXTiles, numYTiles);
	}

	public initialize(gl: WebGLRenderingContext): void {
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

	public reset(): void {
		this.introTime = 3 * 60;
		this.playerDeadState = undefined;
		this.ghostModeInfo = {
			currentGhostMode: undefined,
			ghostModeDuration: Map.ghostModeDuration,
			swaps: 5,
		};
		this.setGhostMode(GhostEntity.GhostMode.SCATTER, false);
		this.children.forEach((c) => {
			if (c instanceof PacEntity) c.reset();
		});
		this.energizers.reset();
		this.pellets.reset();
	}

	public removePelletAt(coords: vec2): number {
		if (this.energizers.removePelletAt(coords)) return 3;
		if (this.pellets.removePelletAt(coords)) return 1;
		return 0;
	}

	public setGhostMode(newMode: GhostEntity.GhostMode, reverse: boolean = true) {
		this.ghostModeInfo.currentGhostMode = newMode;
		this.ghostModeInfo.ghostModeDuration = Map.ghostModeDuration;
		this.children.forEach((child) => {
			if (child instanceof GhostEntity) {
				child.setGhostMode(newMode, reverse);
			}
		});
	}

	public setPlayerDirection(direction: Direction): void {
		this.pacman.setDesired(direction);
	}

	public update(deltaTime: number): boolean {
		if (this.introTime) this.introTime--;
		else if (this.playerDeadState) this.deadTick(deltaTime);
		else this.gameTick(deltaTime);

		return true;
	}

	private deadTick(deltaTime: number): void {
		if (this.playerDeadState.deadPauseTimer > 0) {
			this.playerDeadState.deadPauseTimer--;
			if (this.playerDeadState.deadPauseTimer <= 0) {
				this.pacman.kill(() => {
					// TODO: Check for gameover
					this.reset();
				});
				this.setGhostMode(GhostEntity.GhostMode.HIDDEN, false);
			}

			this.energizers.update(deltaTime);
			return;
		}

		super.update(deltaTime);
	}

	private gameTick(deltaTime: number): void {
		this.ghostModeInfo.ghostModeDuration--;

		if (this.ghostModeInfo.ghostModeDuration <= 0 && this.ghostModeInfo.swaps > 0) {
			this.ghostModeInfo.swaps--;

			this.setGhostMode(this.ghostModeInfo.currentGhostMode === GhostEntity.GhostMode.SCATTER ?
				GhostEntity.GhostMode.CHASE : GhostEntity.GhostMode.SCATTER);
		}

		super.update(deltaTime);

		if (this.pacman.isAlive) {
			this.children.forEach((c) => {
				if (c instanceof GhostEntity && c.tilePosition.exactEquals(this.pacman.tilePosition)) {
					this.playerDeadState = {
						deadPauseTimer: 1 * 60,
					};
				}
			});
		}
	}

	public canMoveToTile(coords: vec2, direction?: Direction): boolean {
		switch (this.getTileInfo(coords)) {
			case Map.BasicTileInfo.GHOST_PEN:
			case Map.BasicTileInfo.BLOCK: return false;
			case Map.BasicTileInfo.SLOW:
			case Map.BasicTileInfo.OPEN: return true;
			case Map.BasicTileInfo.RESTRICTED_UP: return !direction || direction !== Direction.UP;
		}
	}

	public getTileInfo(coords: vec2): Map.BasicTileInfo {
		coords = this.orientCoords(coords);
		return this.metadata.basicTileInfo[coords.y][coords.x];
	}

	/**
	 * Wrap coords to other side of board if they are off of the edge
	 */
	public orientCoords(tileCoords: vec2): vec2 {
		return tileCoords.cmod(this.tileDimensions);
	}
}

namespace Map {
	export enum BasicTileInfo {
		BLOCK = 'BLOCK',
		OPEN = 'OPEN',
		SLOW = 'SLOW',
		RESTRICTED_UP = 'RESTRICTED_UP',
		GHOST_PEN = 'GHOST_PEN',
	}
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

function parseMapInfo(tiles: MapTile[][]): IMapMetaData {
	const numYTiles = tiles.length;
	const numXTiles = tiles[0].length;
	const textureData = [];
	for (let tileY = 0; tileY < numYTiles; tileY++) {
		const tileRow = tiles[tileY];
		for (let pixelY = 0; pixelY < Map.PIXELS_PER_TILE; pixelY++) {
			for (let tileX = 0; tileX < numXTiles; tileX++) {
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

	const scatterTargets = { pacman: undefined, blinky: undefined, pinky: undefined, inky: undefined, clyde: undefined };
	const startingTiles = { pacman: undefined, blinky: undefined, pinky: undefined, inky: undefined, clyde: undefined };
	const basicTileInfo = [];
	const pellets = [];
	const energizers = [];
	for (let tileY = 0; tileY < numYTiles; tileY++) {
		const tileRow = tiles[tileY];
		const basicRowInfo = [];
		basicTileInfo.push(basicRowInfo);
		for (let tileX = 0; tileX < numXTiles; tileX++) {
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

	return {
		staticContentTextureData: new Uint8Array(textureData),
		startingTiles,
		scatterTargets,
		basicTileInfo,
		pellets,
		energizers,
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

export default Map;
