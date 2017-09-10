import { AnimationType } from './AnimationType';
import { Coordinate } from '../Utils';

export abstract class Animation {
	public readonly animationType: AnimationType;
	public readonly position: Coordinate;
	public remainingDurationMs: number;
	private readonly originalDurationMs: number;

	public constructor(position: Coordinate, animationType: AnimationType, durationMs: number) {
		this.animationType = animationType;
		this.originalDurationMs = this.remainingDurationMs = durationMs;
		this.position = position;
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
