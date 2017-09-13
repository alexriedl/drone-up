import Animation from './Animation';
import AnimationType from './AnimationType';
import { Coordinate } from '../Utils';

export default class MoveAnimation extends Animation {
	public readonly position: Coordinate;
	protected startPos: Coordinate;
	protected endPos: Coordinate;

	public constructor(startPos: Coordinate, endPos: Coordinate, animationType: AnimationType, duration: number = 250) {
		super(animationType, duration);

		this.position = startPos;
		this.startPos = startPos;
		this.endPos = endPos;
	}

	public update(deltaTimeMs: number): boolean {
		let effectiveDeltaTime = deltaTimeMs;
		if (effectiveDeltaTime > this.remainingDurationMs) effectiveDeltaTime = this.remainingDurationMs;

		this.position.x += (this.endPos.x - this.position.x) / this.remainingDurationMs * effectiveDeltaTime;
		this.position.y += (this.endPos.y - this.position.y) / this.remainingDurationMs * effectiveDeltaTime;

		this.remainingDurationMs -= effectiveDeltaTime;
		return this.isFinished();
	}
}
