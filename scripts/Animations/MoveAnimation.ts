import { Animation } from './Animation';
import { AnimationType } from './AnimationType';
import { Coordinate } from '../Utils';

export default class MoveAnimation extends Animation {
	protected startPos: Coordinate;
	protected endPos: Coordinate;

	public constructor(startPos: Coordinate, endPos: Coordinate, animationType: AnimationType) {
		super(startPos, animationType, 250);

		this.startPos = startPos;
		this.endPos = endPos;
	}

	public update(deltaTimeMs: number): boolean {
		let effectiveDeltaTime = deltaTimeMs;
		if (effectiveDeltaTime > this.durationMs) effectiveDeltaTime = this.durationMs;

		this.position.x += (this.endPos.x - this.position.x) / this.durationMs * effectiveDeltaTime;
		this.position.y += (this.endPos.y - this.position.y) / this.durationMs * effectiveDeltaTime;
		this.durationMs -= effectiveDeltaTime;

		return this.isFinished();
	}
}
