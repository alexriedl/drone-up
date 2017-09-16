import Animation from './Animation';

export default class ResizeAnimation extends Animation {
	public size: number;
	protected startSize: number;
	protected endSize: number;

	public constructor(startSize: number, endSize: number, duration: number = 250) {
		super(duration);

		this.size = startSize;
		this.startSize = startSize;
		this.endSize = endSize;
	}

	public update(deltaTimeMs: number): boolean {
		const p = this.getProgressPercent();
		this.size = (1 - p) * this.startSize + p * this.endSize;
		return super.update(deltaTimeMs);
	}
}
