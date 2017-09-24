// tslint:disable:no-bitwise

import { Color } from 'Engine/Utils';
import { SimpleTextureRectangle } from 'Engine/Model';
import { vec3 } from 'Engine/Math';
import Entity from 'Engine/Entity';
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

	_p_, // Pac
	_E_, // Energizer
	FFF, // Full
	___, // Empty
}

const smallDemo = [
	[MI.DNW, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DNE],
	[MI.DW_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.DE_],
	[MI.DW_, MI.___, MI.SSE, MI.SS_, MI.SSW, MI.___, MI.DE_],
	[MI.DW_, MI.___, MI.SE_, MI.___, MI.SW_, MI.___, MI.DE_],
	[MI.DW_, MI.___, MI.SNE, MI.SN_, MI.SNW, MI.___, MI.DE_],
	[MI.DW_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.DE_],
	[MI.DSW, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DSE],
];

// tslint:disable:max-line-length
const original = [
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
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.PSE, MI.DS_, MI.PEW, MI.GGG, MI.GGG, MI.PEE, MI.DS_, MI.PSW, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI.___, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI.___, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI._p_, MI.___, MI.___, MI.___, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI.___, MI.___, MI.___, MI._p_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.SSW, MI._p_, MI.SSE, MI.SSW, MI.___, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI.___, MI.SSE, MI.SSW, MI._p_, MI.SSE, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.PNE, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.PNW, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.___, MI.___, MI.___, MI.___, MI.___, MI.DW_, MI._p_, MI.SE_, MI.SW_, MI.___, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI.___, MI.SE_, MI.SW_, MI._p_, MI.DE_, MI.___, MI.___, MI.___, MI.___, MI.___],
	[MI.DNW, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI.___, MI.SNE, MI.SN_, MI.SN_, MI.INE, MI.INW, MI.SN_, MI.SN_, MI.SNW, MI.___, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.DN_, MI.DN_, MI.DN_, MI.DN_, MI.DNE],
	[MI.DW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SNE, MI.SN_, MI.INE, MI.SW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SE_, MI.INW, MI.SN_, MI.SNW, MI._p_, MI.DE_],
	[MI.DW_, MI._E_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.___, MI.___, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._E_, MI.DE_],
	[MI.WSW, MI.SS_, MI.SSW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SSE, MI.SSW, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SSE, MI.SSW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SSE, MI.SS_, MI.ESE],
	[MI.WNW, MI.SN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.INE, MI.INW, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.SN_, MI.ENE],
	[MI.DW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI.SE_, MI.SW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.ISE, MI.ISW, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.SE_, MI.SW_, MI._p_, MI.SSE, MI.SS_, MI.SS_, MI.ISE, MI.ISW, MI.SS_, MI.SS_, MI.SS_, MI.SS_, MI.SSW, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.SNE, MI.SNW, MI._p_, MI.SNE, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SN_, MI.SNW, MI._p_, MI.DE_],
	[MI.DW_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI._p_, MI.DE_],
	[MI.DSW, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DS_, MI.DSE],
];

const tiles = original;

const BORDER = [0x21, 0x21, 0xFF, 0xFF];
const PAC = [0xFF, 0xFF, 0xFF, 0xFF];
const GATE = [0xFF, 0xB8, 0xFF, 0xFF];
const EMPTY = [0x00, 0x00, 0x00, 0x00];

const boardWidth = tiles[0].length;
const boardHeight = tiles.length;
const TILE_WIDTH = 8;
const TILE_HEIGHT = 8;

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

		case MI._p_: return [0x00, 0x00, 0x00, 0x18, 0x18, 0x00, 0x00, 0x00];
		case MI._E_: return [0x3C, 0x7E, 0xFF, 0xFF, 0xFF, 0xFF, 0x7E, 0x3C];

		case MI.FFF: return [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
		case MI.___: default: return [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
	}
}

function getTileColor(tile: MI): number[] {
	switch (tile) {
		case MI.___: return EMPTY;
		case MI._p_: case MI._E_: return PAC;
		case MI.GGG: return GATE;
		default: return BORDER;
	}
}

function generateLevelTextureData(): Uint8Array {
	const data = [];
	for (let tileY = 0; tileY < boardHeight; tileY++) {
		// if (tileY < 3 || tileY > 33) continue;
		const tileRow = tiles[tileY];
		for (let pixelY = 0; pixelY < TILE_HEIGHT; pixelY++) {
			for (let tileX = 0; tileX < boardWidth; tileX++) {
				const tileEnum = tileRow[tileX];
				const tile = getTileValue(tileEnum);
				const color = getTileColor(tileEnum);
				const pixelRow = tile[pixelY];

				for (let pixelX = TILE_WIDTH - 1; pixelX >= 0; pixelX--) {
					const pixel = isBitSet(pixelX, pixelRow);
					data.push.apply(data, pixel ? color : EMPTY);
				}
			}
		}
	}

	return new Uint8Array(data);
}

function generateLevelTexture(gl: WebGLRenderingContext): WebGLTexture {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
		boardWidth * TILE_WIDTH, boardHeight * TILE_HEIGHT, 0,
		gl.RGBA, gl.UNSIGNED_BYTE, generateLevelTextureData());

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	gl.bindTexture(gl.TEXTURE_2D, null);
	return texture;
}

function createLevel(gl: WebGLRenderingContext): Entity {
	const texture = generateLevelTexture(gl);

	const levelModel = new SimpleTextureRectangle(texture);
	const levelObject = new Entity(levelModel,
		new vec3(boardWidth / 2, boardHeight / 2),
		new vec3(boardWidth, boardHeight, 1));

	return levelObject;
}

function start(): void {
	const renderer = new Renderer('game-canvas', boardWidth, boardHeight);
	const level = createLevel(renderer.gl);
	const background = Color.BLACK;
	let then;

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

		renderer.simpleRender(level, background);

		requestAnimationFrame(frame);
	};

	requestAnimationFrame(frame);
}

start();
