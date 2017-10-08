import { SpriteMap } from 'Engine/Model';

export default abstract class PacMap extends SpriteMap {
	private currentFrames: number[];
	private currentFrame: number;

	protected abstract readonly spriteCount: number;
	protected abstract readonly source: string;
	protected abstract readonly left: number[];
	protected abstract readonly right: number[];
	protected abstract readonly up: number[];
	protected abstract readonly down: number[];
	protected readonly textureWidth: number = 16 * 3;
	protected readonly textureHeight: number = 16 * 3;

	public constructor() {
		super();
		this.reset();
	}

	public goLeft(): void { this.currentFrames = this.left; }
	public goRight(): void { this.currentFrames = this.right; }
	public goUp(): void { this.currentFrames = this.up; }
	public goDown(): void { this.currentFrames = this.down; }

	public nextFrame(onLoop?: () => void): void {
		if (!this.currentFrames || this.currentFrames.length <= 0) return;
		this.currentFrame = (this.currentFrame + 1) % this.currentFrames.length;
		this.setFrame(this.currentFrames[this.currentFrame]);
		if (this.currentFrame === 0 && onLoop) onLoop();
	}

	protected getMapInfo(): SpriteMap.IMapInfo {
		return {
			textureWidth: this.textureWidth,
			textureHeight: this.textureHeight,
			spritWidth: 16,
			spritHeight: 16,
			totalSprites: this.spriteCount,
			source: this.source,
		};
	}

	public reset(): void {
		this.currentFrames = this.right;
		this.currentFrame = 0;
	}
}
