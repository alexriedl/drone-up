import { Buffer, CustomBuffer } from 'Engine/Model/Buffer';
import { Color } from 'Engine/Utils';
import { TextureShader } from 'Engine/Model/Shader';
import SimpleRectangle from './SimpleRectangle';

export interface IMapInfo {
	leftPadding?: number;
	topPadding?: number;
	textureWidth: number;
	textureHeight: number;
	spritWidth: number;
	spritHeight: number;
	totalSprites: number;
}

function buildBuffer(mapInfo: IMapInfo): number[] {
	const buffer = [];
	let count = 0;
	for (let y = mapInfo.topPadding;
		y < mapInfo.textureHeight && count < mapInfo.totalSprites;
		y += mapInfo.spritHeight) {
		for (let x = mapInfo.leftPadding;
			x < mapInfo.textureWidth && count < mapInfo.totalSprites;
			x += mapInfo.spritWidth) {
			count++;
			const left = x / mapInfo.textureWidth;
			const right = (x + mapInfo.spritWidth) / mapInfo.textureWidth;
			const top = y / mapInfo.textureHeight;
			const bottom = (y + mapInfo.spritHeight) / mapInfo.textureHeight;

			buffer.push(
				left, top,
				right, top,
				right, bottom,
				left, bottom,
			);
		}
	}

	return buffer;
}

let info: IMapInfo;

export default class SpriteMap extends SimpleRectangle {
	protected textureBuffer: Buffer;
	protected shader: TextureShader;
	protected texture: WebGLTexture;

	protected frame: number;
	protected mapInfo: IMapInfo;

	public constructor(texture: WebGLTexture, mapInfo: IMapInfo) {
		if (!mapInfo.leftPadding) mapInfo.leftPadding = 0;
		if (!mapInfo.topPadding) mapInfo.topPadding = 0;
		info = mapInfo;

		super(new Color(1, 1, 1));
		this.textureBuffer = this.createTextureBuffer(mapInfo);
		this.texture = texture;

		this.mapInfo = mapInfo;
		this.frame = 0;
	}

	protected createTextureBuffer(mapInfo: IMapInfo): Buffer {
		return new CustomBuffer(buildBuffer(mapInfo));
	}

	public setFrame(frame: number): number {
		const oldFrame = this.frame;
		this.frame = frame % this.mapInfo.totalSprites;
		return oldFrame;
	}

	protected createShader(): TextureShader {
		return TextureShader.createShader();
	}

	protected updateAttributes(gl: WebGLRenderingContext): void {
		super.updateAttributes(gl);

		const shader = this.shader;
		const textureBuffer = this.textureBuffer.getBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.vertexAttribPointer(shader.attributeTexCoordLocation, 2, gl.FLOAT, false, 0, this.frame * 8 * 4);
		gl.enableVertexAttribArray(shader.attributeTexCoordLocation);

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}
}
