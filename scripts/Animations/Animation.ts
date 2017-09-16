import AnimationType from './AnimationType';

export default class Animation {
	public readonly animationType: AnimationType;
	public remainingDurationMs: number;
	private readonly originalDurationMs: number;

	public constructor(animationType: AnimationType, durationMs: number) {
		this.animationType = animationType;
		this.originalDurationMs = this.remainingDurationMs = durationMs;
	}

	public update(deltaTimeMs: number): boolean {
		let effectiveDeltaTime = deltaTimeMs;
		if (effectiveDeltaTime > this.remainingDurationMs) effectiveDeltaTime = this.remainingDurationMs;
		this.remainingDurationMs -= effectiveDeltaTime;
		return this.isFinished();
	}

	public getProgressPercent(): number {
		if (this.originalDurationMs <= 0) return 0;
		return 1 - (this.remainingDurationMs / this.originalDurationMs);
	}

	public isFinished(): boolean {
		return this.remainingDurationMs <= 0;
	}
}
