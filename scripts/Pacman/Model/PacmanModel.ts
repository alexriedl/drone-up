import { Color } from 'Engine/Utils';
import { vec2 } from 'Engine/Math';
import SpriteMap, { IMapInfo } from 'Engine/Model/SpriteMap';

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

// NOTE: Sprite Color
enum SC { P, S, W, B, T /* Primary, Secondary, White, Black, Transparent */ }

const pacmanTextureInfo = [
	[SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T],
	[SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.T, SC.T, SC.P, SC.P, SC.P, SC.P, SC.P, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T],
	[SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T, SC.T],
];

function infoToData(info: SC[][], primary?: Color, secondary?: Color): { data: Uint8Array, dimensions: vec2 } {
	const data = [];
	const numYPixels = info.length;
	const numXPixels = info[0].length;
	const t = new Color(0x00, 0x00, 0x00, 0x00).rgba;
	const w = new Color(0xFF, 0xFF, 0xFF, 0xFF).rgba;
	const b = new Color(0x00, 0x00, 0x00, 0xFF).rgba;
	const p = primary ? primary.rgba : w;
	const s = secondary ? secondary.rgba : p;

	for (let pixelY = 0; pixelY < numYPixels; pixelY++) {
		const row = info[pixelY];
		for (let pixelX = 0; pixelX < numXPixels; pixelX++) {
			const pixel = row[pixelX];
			let color;
			switch (pixel) {
				case SC.P: color = p; break;
				case SC.S: color = s; break;
				case SC.W: color = w; break;
				case SC.B: color = b; break;
				case SC.T: color = t; break;
			}
			data.push.apply(data, color);
		}
	}

	return {
		data: new Uint8Array(data),
		dimensions: new vec2(numXPixels, numYPixels),
	};
}

export default class PacmanModel extends SpriteMap {
	public constructor() {
		super(undefined, {
			textureWidth: 16,
			textureHeight: 16,
			spritWidth: 16,
			spritHeight: 16,
			totalSprites: 1,
		});
	}

	public initialize(gl: WebGLRenderingContext): void {
		const dataInfo = infoToData(pacmanTextureInfo, new Color(0xFF, 0xCC, 0x00, 0xFF));
		this.texture = createTexture(gl, dataInfo.data, dataInfo.dimensions);
	}
}
