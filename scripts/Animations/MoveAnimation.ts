import { ICoords, ObjectType } from '../Utils';
import { Animation } from './Animation';
import { AnimationType } from './AnimationType';

import RenderGroup from '../Renderer/RenderGroup';
import Color from '../Utils/Color';

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
		if (effectiveDeltaTime > this.durationMs) effectiveDeltaTime = this.durationMs;

		this.position.x += (this.endPos.x - this.position.x) / this.durationMs * effectiveDeltaTime;
		this.position.y += (this.endPos.y - this.position.y) / this.durationMs * effectiveDeltaTime;
		this.durationMs -= effectiveDeltaTime;

		return this.isFinished();
	}
}
