import { Color } from 'Engine/Utils';
import { vec2 } from 'Engine/Math';
import SpriteMap, { IMapInfo } from 'Engine/Model/SpriteMap';

export default class PacmanModel extends SpriteMap {
	private readonly left: number[];
	private readonly right: number[];
	private readonly up: number[];
	private readonly down: number[];

	private currentFrames: number[];
	private currentFrame: number;

	public constructor() {
		super(undefined, {
			textureWidth: 16 * 3,
			textureHeight: 16 * 3,
			spritWidth: 16,
			spritHeight: 16,
			totalSprites: 9,
		});

		this.left = [1, 2, 1, 0];
		this.right = [3, 4, 3, 0];
		this.up = [5, 6, 5, 0];
		this.down = [7, 8, 7, 0];

		this.currentFrames = this.right;
		this.currentFrame = 0;
	}

	public goLeft(): void { this.currentFrames = this.left; }
	public goRight(): void { this.currentFrames = this.right; }
	public goUp(): void { this.currentFrames = this.up; }
	public goDown(): void { this.currentFrames = this.down; }

	public nextFrame(): void {
		this.currentFrame = (this.currentFrame + 1) % this.currentFrames.length;
		this.setFrame(this.currentFrames[this.currentFrame]);
	}

	public initialize(gl: WebGLRenderingContext): void {
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);

		const image = new Image();
		image.src = 'Images/pacman.png';
		image.onload = () => {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.bindTexture(gl.TEXTURE_2D, null);
		};
	}
}
