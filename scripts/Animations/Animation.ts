import { AnimationType } from './AnimationType';
import { Coordinate } from '../Utils';

export abstract class Animation {
	public readonly animationType: AnimationType;
	public durationMs: number;
	public readonly position: Coordinate;

	public constructor(position: Coordinate, animationType: AnimationType, durationMs: number) {
		this.animationType = animationType;
		this.durationMs = durationMs;
		this.position = position;
	}

	public abstract update(deltaTimeMs: number): boolean;

	public isFinished(): boolean {
		return this.durationMs <= 0;
	}
}
