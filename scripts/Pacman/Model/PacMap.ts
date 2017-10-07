import { SpriteMap } from 'Engine/Model';

export default abstract class PacMap extends SpriteMap {
	private currentFrames: number[];
	private currentFrame: number;

	protected abstract spriteCount: number;
	protected abstract source: string;
	protected abstract left: number[];
	protected abstract right: number[];
	protected abstract up: number[];
	protected abstract down: number[];

	public constructor() {
		super();

		this.currentFrames = this.right;
		this.currentFrame = 0;
	}

	public goLeft(): void { this.currentFrames = this.left; }
	public goRight(): void { this.currentFrames = this.right; }
	public goUp(): void { this.currentFrames = this.up; }
	public goDown(): void { this.currentFrames = this.down; }

	public nextFrame(): void {
		if (!this.currentFrames || this.currentFrames.length <= 0) return;
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
