import Animation from './Animation';
import AnimationType from './AnimationType';
import { Coordinate } from '../Utils';

export default class ResizeAnimation extends Animation {
	public size: number;
	protected startSize: number;
	protected endSize: number;

	public constructor(startSize: number, endSize: number, duration: number = 250) {
		super(AnimationType.Resize, duration);

		this.size = startSize;
		this.startSize = startSize;
		this.endSize = endSize;
	}

	public update(deltaTimeMs: number): boolean {
		let effectiveDeltaTime = deltaTimeMs;
		if (effectiveDeltaTime > this.remainingDurationMs) effectiveDeltaTime = this.remainingDurationMs;

		const p = this.getProgressPercent();
		this.size = (1 - p) * this.startSize + p * this.endSize;

		this.remainingDurationMs -= effectiveDeltaTime;
		return this.isFinished();
	}
}
