import { Color } from 'Engine/Utils';
import { SpriteMap } from 'Engine/Model';
import { vec2 } from 'Engine/Math';

export default abstract class PacMap extends SpriteMap {
	private currentFrames: number[];
	private currentFrame: number;

	public constructor() {
		super();

		this.currentFrames = this.right;
		this.currentFrame = 0;
	}

	public goLeft(): void { this.currentFrames = this.left; }
	public goRight(): void { this.currentFrames = this.right; }
	public goUp(): void { this.currentFrames = this.up; }
	public goDown(): void { this.currentFrames = this.down; }

	protected abstract get spriteCount(): number;
	protected abstract get source(): string;
	protected abstract get left(): number[];
	protected abstract get right(): number[];
	protected abstract get up(): number[];
	protected abstract get down(): number[];

	public nextFrame(): void {
		this.currentFrame = (this.currentFrame + 1) % this.currentFrames.length;
		this.setFrame(this.currentFrames[this.currentFrame]);
	}

	protected getMapInfo(): SpriteMap.IMapInfo {
		return {
			textureWidth: 16 * 3,
			textureHeight: 16 * 3,
			spritWidth: 16,
			spritHeight: 16,
			totalSprites: this.spriteCount,
			source: this.source,
		};
	}
}
