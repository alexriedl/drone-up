export default class Animation<T = any> {
	public remainingDurationMs: number;
	private readonly originalDurationMs: number;
	public readonly extraInfo: T;

	public constructor(durationMs: number, extraInfo?: T) {
		this.originalDurationMs = this.remainingDurationMs = durationMs;
		this.extraInfo = extraInfo;
	}

	public update(deltaTimeMs: number): boolean {
		let effectiveDeltaTime = deltaTimeMs;
		if (effectiveDeltaTime > this.remainingDurationMs) effectiveDeltaTime = this.remainingDurationMs;
		this.remainingDurationMs -= effectiveDeltaTime;
		return this.continueing();
	}

	public getProgressPercent(): number {
		if (this.originalDurationMs <= 0) return 0;
		return 1 - (this.remainingDurationMs / this.originalDurationMs);
	}

	public continueing(): boolean {
		return this.remainingDurationMs > 0;
	}
}
