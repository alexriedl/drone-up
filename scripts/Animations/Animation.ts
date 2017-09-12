import { AnimationType } from './AnimationType';
import { Coordinate } from '../Utils';

abstract class Animation {
	public readonly animationType: AnimationType;
	public remainingDurationMs: number;
	private readonly originalDurationMs: number;

	public constructor(animationType: AnimationType, durationMs: number) {
		this.animationType = animationType;
		this.originalDurationMs = this.remainingDurationMs = durationMs;
	}

	public abstract update(deltaTimeMs: number): boolean;

	public getProgressPercent(): number {
		if (this.originalDurationMs <= 0) return 0;
		return 1 - (this.remainingDurationMs / this.originalDurationMs);
	}

	public isFinished(): boolean {
		return this.remainingDurationMs <= 0;
	}
}

export default Animation;
