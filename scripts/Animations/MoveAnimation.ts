import Animation from './Animation';
import AnimationType from './AnimationType';
import { vec2 } from '../Math';

export default class MoveAnimation extends Animation {
	public position: vec2;
	protected startPos: vec2;
	protected endPos: vec2;

	public constructor(startPos: vec2, endPos: vec2, animationType: AnimationType, duration: number = 250) {
		super(animationType, duration);

		this.position = startPos;
		this.startPos = startPos;
		this.endPos = endPos;
	}

	public update(deltaTimeMs: number): boolean {
		let effectiveDeltaTime = deltaTimeMs;
		if (effectiveDeltaTime > this.remainingDurationMs) effectiveDeltaTime = this.remainingDurationMs;

		const p = this.getProgressPercent();
		const x = (1 - p) * this.startPos.x + p * this.endPos.x;
		const y = (1 - p) * this.startPos.y + p * this.endPos.y;
		this.position = new vec2(x, y);

		this.remainingDurationMs -= effectiveDeltaTime;
		return this.isFinished();
	}
}
