// tslint:disable:no-bitwise

import { Color } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle, SimpleRectangle } from 'Engine/Model';
import { vec2, vec3 } from 'Engine/Math';
import Renderer from 'Engine/Renderer';

enum MI {
	DNW, // Double North West
	DNE, // Double North East
	DSW, // Double South West
	DSE, // Double South East

	DN_, // Double North
	DS_, // Double Sorth
	DE_, // Double East
	DW_, // Double West

	SN_, // Single North
	SS_, // Single North
	SE_, // Single North
	SW_, // Single North

	SNW, // Single North West
	SNE, // Single North East
	SSW, // Single South West
	SSE, // Single South East

	PEE, // Pen End East
	PEW, // Pen End West
	GGG, // Pen Gate

	PNW, // Pen North West
	PNE, // Pen North East
	PSW, // Pen South West
	PSE, // Pen South East

	INW, // Inner North West
	INE, // Inner North East
	ISW, // Inner South West
	ISE, // Inner South East

	NNW, // North (barrior) North West
	NNE, // North (barrior) North East

	ENE, // East (barrior) North East
	ESE, // East (barrior) South East

	WNW, // West (barrior) North West
	WSW, // West (barrior) South West

	// Starting Points
	_PS, // Pac Start
	_FS, // Fruit Start
	GSB, // Ghost Start Blinky
	GSP, // Ghost Start Pinky
	GSI, // Ghost Start Inky
	GSC, // Ghost Start Clyde

	// Pacs
	_p_, // Pac
	_E_, // Energizer

	// Special
	_s_, // Slow (Empty)
	RU_, // Restrict Up
	RR_, // Restrict Right
	RUp, // Restrict Up (with a pac)
	GTB, // Ghost Target Blinky
	GTP, // Ghost Target Pinky
	GTI, // Ghost Target Inky
	GTC, // Ghost Target Clyde

	// Extra
	FFF, // Full
	___, // Empty
}

// tslint:disable:max-line-length
const original = [
	[MI.___, MI.___, MI.GTP, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.GTB, MI.___, MI.___],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.DNW, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.NNE, MI.NNW, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DNE],
	[MI.DW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.DE_],
	[MI.DW_, MI._E_, MI.SE_, MI.___, MI.___, MI.SW_, MI._p_, MI.SE_, MI.___, MI.___, MI.___, MI.SW_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SE_, MI.___, MI.___, MI.___, MI.SW_, MI._p_, MI.SE_, MI.___, MI.___, MI.SW_, MI._E_, MI.DE_],
	[MI.DW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.INE, MI.INW, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.DE_],
	[MI.DSW, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.SSW, MI._p_, MI.SE_, MI.ISW, MI.SS_, MI.SS_, MI.SSW, MI.___, MI.SE_, MI.SW_, MI.___, MI.SSE, MI.SS_, MI.SS_, MI.ISE, MI.SW_, MI._p_, MI.SSE, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DSE],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.INW, MI.SN_, MI.SN_, MI.SNW, MI.___, MI.SNE, MI.SNW, MI.___, MI.SNE, MI.SN_, MI.SN_, MI.INE, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.___, MI.___, MI.RU_, MI.GSB, MI.RR_, MI.RU_, MI.___, MI.___, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.PSE, MI.DS_, MI.PEW, MI.GGG, MI.GGG, MI.PEE, MI.DS_, MI.PSW, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI.___, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI.___, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_],
	[MI._s_, MI._s_, MI._s_, MI._s_, MI._s_, MI.___, MI._p_, MI.___, MI.___, MI.___, MI.DE_, MI.GSI, MI.___, MI.GSP, MI.___, MI.GSC, MI.___, MI.DW_, MI.___, MI.___, MI.___, MI._p_, MI.___, MI._s_, MI._s_, MI._s_, MI._s_, MI._s_],
	[MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.SSW, MI._p_, MI.SSE, MI.SSW, MI.___, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI.___, MI.SSE, MI.SSW, MI._p_, MI.SSE, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.PNE, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.PNW, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.___, MI.___, MI.___, MI._FS, MI.___, MI.___, MI.___, MI.___, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.DNW, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI.___, MI.SNE, MI.SN_, MI.SN_, MI.INE, MI.INW, MI.SN_, MI.SN_, MI.SNW, MI.___, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DNE],
	[MI.DW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SNE, MI.SN_, MI.INE, MI.SW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SE_, MI.INW, MI.SN_, MI.SNW, MI._p_, MI.DE_],
	[MI.DW_, MI._E_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.RUp, MI._PS, MI.___, MI.RUp, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._E_, MI.DE_],
	[MI.WSW, MI.SS_, MI.SSW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SSE, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SSW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SSE, MI.SS_, MI.ESE],
	[MI.WNW, MI.SN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.INE, MI.INW, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.SN_, MI.ENE],
	[MI.DW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.ISE, MI.ISW, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.ISE, MI.ISW, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.DE_],
	[MI.DSW, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DSE],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.GTC, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.GTI],
];

const tiles = original;

const NUM_X_TILES = tiles[0].length;
const NUM_Y_TILES = tiles.length;
const PIXELS_PER_TILE = 8;

function isBitSet(bit: number, value: number): boolean {
	return !!(value & (1 << bit));
}

function getTileValue(tile: MI): number[] {
	switch (tile) {
		case MI.DNW: return [0x07, 0x18, 0x20, 0x47, 0x48, 0x90, 0x90, 0x90];
		case MI.DNE: return [0xE0, 0x18, 0x04, 0xE2, 0x12, 0x09, 0x09, 0x09];
		case MI.DSW: return [0x90, 0x90, 0x90, 0x48, 0x47, 0x20, 0x18, 0x07];
		case MI.DSE: return [0x09, 0x09, 0x09, 0x12, 0xE2, 0x04, 0x18, 0xE0];

		case MI.DN_: return [0xFF, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00];
		case MI.DS_: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xFF];
		case MI.DE_: return [0x09, 0x09, 0x09, 0x09, 0x09, 0x09, 0x09, 0x09];
		case MI.DW_: return [0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90];

		case MI.SN_: return [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00];
		case MI.SS_: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00];
		case MI.SE_: return [0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08];
		case MI.SW_: return [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10];

		case MI.SNW: return [0x10, 0x10, 0x20, 0xC0, 0x00, 0x00, 0x00, 0x00];
		case MI.SNE: return [0x08, 0x08, 0x04, 0x03, 0x00, 0x00, 0x00, 0x00];
		case MI.SSW: return [0x00, 0x00, 0x00, 0x00, 0xC0, 0x20, 0x10, 0x10];
		case MI.SSE: return [0x00, 0x00, 0x00, 0x00, 0x03, 0x04, 0x08, 0x08];

		case MI.PEE: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x80, 0x80, 0xFF];
		case MI.PEW: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x01, 0x01, 0xFF];
		case MI.GGG: return [0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00];

		case MI.PNW: return [0x90, 0x10, 0x10, 0xF0, 0x00, 0x00, 0x00, 0x00];
		case MI.PNE: return [0x09, 0x08, 0x08, 0x0F, 0x00, 0x00, 0x00, 0x00];
		case MI.PSW: return [0x00, 0x00, 0x00, 0x00, 0xF0, 0x10, 0x10, 0x90];
		case MI.PSE: return [0x00, 0x00, 0x00, 0x00, 0x0F, 0x08, 0x08, 0x09];

		case MI.INW: return [0x00, 0x00, 0x00, 0x07, 0x08, 0x10, 0x10, 0x10];
		case MI.INE: return [0x00, 0x00, 0x00, 0xE0, 0x10, 0x08, 0x08, 0x08];
		case MI.ISW: return [0x10, 0x10, 0x10, 0x08, 0x07, 0x00, 0x00, 0x00];
		case MI.ISE: return [0x08, 0x08, 0x08, 0x10, 0xE0, 0x00, 0x00, 0x00];

		case MI.NNW: return [0xFF, 0x00, 0x00, 0x07, 0x08, 0x10, 0x10, 0x10];
		case MI.NNE: return [0xFF, 0x00, 0x00, 0xE0, 0x10, 0x08, 0x08, 0x08];
		case MI.ENE: return [0x01, 0x01, 0x01, 0xE1, 0x11, 0x09, 0x09, 0x09];
		case MI.ESE: return [0x09, 0x09, 0x09, 0x11, 0xE1, 0x01, 0x01, 0x01];
		case MI.WNW: return [0x80, 0x80, 0x80, 0x87, 0x88, 0x90, 0x90, 0x90];
		case MI.WSW: return [0x90, 0x90, 0x90, 0x88, 0x87, 0x80, 0x80, 0x80];

		case MI.RUp:
		case MI._p_: return [0x00, 0x00, 0x00, 0x18, 0x18, 0x00, 0x00, 0x00];
		case MI._E_: return [0x3C, 0x7E, 0xFF, 0xFF, 0xFF, 0xFF, 0x7E, 0x3C];

		case MI._PS:
		case MI.GSB:
		case MI.GSP:
		case MI.GSI:
		case MI.GSC:
			return [0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00];

		case MI.GTB: case MI.GTP: case MI.GTI: case MI.GTC:
		case MI.FFF: return [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
		case MI.___: default: return [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
	}
}

const COLOR_BORDER = new Color(0x21, 0x21, 0xFF, 0xFF).rgba;
const COLOR_GATE = new Color(0xFF, 0xB8, 0xFF, 0xFF).rgba;
const COLOR_EMPTY = Color.BLACK.scale(255).rgba;
const COLOR_PAC = new Color(0xFF, 0xDE, 0xD2, 0xFF).rgba;
const COLOR_PACMAN = new Color(0xFF, 0xCC, 0x00, 0xFF).rgba;
const COLOR_BLINKY = new Color(0xFF, 0x00, 0x00, 0xFF).rgba;
const COLOR_PINKY = new Color(0xFF, 0xB8, 0xFF, 0xFF).rgba;
const COLOR_INKY = new Color(0x00, 0xFF, 0xFF, 0xFF).rgba;
const COLOR_CLYDE = new Color(0xFF, 0xB8, 0x51, 0xFF).rgba;
function getTileColor(tile: MI): number[] {
	switch (tile) {
		case MI.___: return COLOR_EMPTY;
		case MI.RUp: case MI._p_: case MI._E_: return COLOR_PAC;
		case MI.GGG: return COLOR_GATE;
		case MI._PS: return COLOR_PACMAN;
		case MI.GSB: case MI.GTB: return COLOR_BLINKY;
		case MI.GSP: case MI.GTP: return COLOR_PINKY;
		case MI.GSI: case MI.GTI: return COLOR_INKY;
		case MI.GSC: case MI.GTC: return COLOR_CLYDE;
		default: return COLOR_BORDER;
	}
}

function generateLevelTextureData(): Uint8Array {
	const data = [];
	for (let tileY = 0; tileY < NUM_Y_TILES; tileY++) {
		// if (tileY < 3 || tileY > 33) continue;
		const tileRow = tiles[tileY];
		for (let pixelY = 0; pixelY < PIXELS_PER_TILE; pixelY++) {
			for (let tileX = 0; tileX < NUM_X_TILES; tileX++) {
				const tileEnum = tileRow[tileX];
				const tile = getTileValue(tileEnum);
				const color = getTileColor(tileEnum);
				const pixelRow = tile[pixelY];

				for (let pixelX = PIXELS_PER_TILE - 1; pixelX >= 0; pixelX--) {
					const pixel = isBitSet(pixelX, pixelRow);
					data.push.apply(data, pixel ? color : COLOR_EMPTY);
				}
			}
		}
	}

	return new Uint8Array(data);
}

function generateLevelTexture(gl: WebGLRenderingContext, width: number, height: number): WebGLTexture {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
		gl.RGBA, gl.UNSIGNED_BYTE, generateLevelTextureData());

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	gl.bindTexture(gl.TEXTURE_2D, null);
	return texture;
}

function createLevel(gl: WebGLRenderingContext, width: number, height: number): Entity {
	const texture = generateLevelTexture(gl, width, height);

	const levelModel = new SimpleTextureRectangle(texture);
	return new Entity(levelModel,
		new vec3(width / 2, height / 2),
		new vec3(width, height, 1));
}

function start(): void {
	const width = NUM_X_TILES * PIXELS_PER_TILE;
	const height = NUM_Y_TILES * PIXELS_PER_TILE;
	const renderer = new Renderer('game-canvas', width, height);
	const background = Color.BLACK;
	let then;

	const level = createLevel(renderer.gl, width, height);
	const test = new PacEntity(new vec2(1, 4));
	const scene = new Entity();
	level.setParent(scene);
	test.setParent(scene);

	const frame = (now: number) => {
		const deltaTime = now - then;
		{
			const skipFrame = !then;
			then = now;

			if (skipFrame) {
				requestAnimationFrame(frame);
				return;
			}
		}

		scene.update(deltaTime);
		renderer.simpleRender(scene, background);

		requestAnimationFrame(frame);
	};

	requestAnimationFrame(frame);
}

class PacEntity extends Entity {
	private facing: vec2;

	public position: vec3;
	public scale: vec3;

	public constructor(startTile: vec2, size: vec2 = new vec2(16, 16)) {
		super(new SimpleRectangle(Color.YELLOW));
		this.position = new vec3((startTile.x + 0.5) * PIXELS_PER_TILE, (startTile.y + 0.5) * PIXELS_PER_TILE);
		this.scale = size.toVec3(1);
		this.facing = new vec2(0, 1);
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

	public getNextTile(): MI {
		const coords = this.getMapCoords().add(this.facing);
		return tiles[coords.y][coords.x];
	}

	public update(deltaTime: number): boolean {
		deltaTime /= 5;
		const newPos = this.position.addValues(this.facing.x * deltaTime, this.facing.y * deltaTime, 0);
		const newMapPos = PacEntity.getMapCoords(vec2.fromArray(newPos.xy));
		const tile = tiles[newMapPos.y][newMapPos.x];
		const canMove = this.canWalkOnTile(tile);
		if (canMove) this.position = newPos;
		else this.facing = PacEntity.randomDirection();

		return super.update(deltaTime);
	}

	protected canWalkOnTile(tile: MI): boolean {
		switch (tile) {
			case MI._PS:
			case MI._FS:
			case MI.GSB:
			case MI.GSP:
			case MI.GSI:
			case MI.GSC:

			case MI._p_:
			case MI._E_:

			case MI._s_:
			case MI.RU_:
			case MI.RR_:
			case MI.RUp:

			case MI.GTB:
			case MI.GTP:
			case MI.GTI:
			case MI.GTC:
				return true;
			default: return false;
		}
	}

	/**
	 * Get which tile this entity is currently on. Tile (0, 0) is the upper left most tile
	 */
	public static getMapCoords(position: vec2): vec2 {
		return position.scale(1 / PIXELS_PER_TILE).floor();
	}

	/**
	 * Get which pixel within a tile this entity is currently on. Pixel (0, 0) is the upper left most pixel within a tile
	 */
	public static getTileCoords(position: vec2): vec2 {
		const x = position.x % PIXELS_PER_TILE;
		const y = position.y % PIXELS_PER_TILE;
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

start();
