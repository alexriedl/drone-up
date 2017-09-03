import { Animation } from './Animation';
import { AnimationType } from './AnimationType';
import { ObjectType, ICoords } from '../Utils';
import Color from '../Utils/Color';
import RenderGroup from '../Renderer/RenderGroup';

export default class MoveAnimation extends Animation {
	protected startPos: ICoords;
	protected endPos: ICoords;

	public constructor(objectID: string, objectType: ObjectType, startPos: ICoords, endPos: ICoords,
		animationType: AnimationType = AnimationType.Move) {
		super(objectID, objectType, startPos, animationType, 250);

		this.startPos = startPos;
		this.endPos = endPos;
	}

	public update(deltaTimeMs: number): boolean {
		let effectiveDeltaTime = deltaTimeMs;
		if (effectiveDeltaTime > this.durationMs)
			effectiveDeltaTime = this.durationMs;

		this.position.x += (this.endPos.x - this.position.x) / this.durationMs * effectiveDeltaTime;
		this.position.y += (this.endPos.y - this.position.y) / this.durationMs * effectiveDeltaTime;
		this.durationMs -= effectiveDeltaTime;

		return this.isFinished();
	}
}
