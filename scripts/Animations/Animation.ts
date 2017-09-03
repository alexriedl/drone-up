import { ICoords, ObjectType } from '../Utils';
import { AnimationType } from './AnimationType';

import RenderGroup from '../Renderer/RenderGroup';
import Color from '../Utils/Color';

export abstract class Animation {
	public readonly objectID: string;
	public readonly objectType: ObjectType;
	public readonly animationType: AnimationType;
	public durationMs: number;
	public readonly position: ICoords;

	public constructor(objectID: string, objectType: ObjectType, position: ICoords,
		animationType: AnimationType, durationMs: number) {
		this.objectID = objectID;
		this.objectType = objectType;
		this.animationType = animationType;
		this.durationMs = durationMs;
		this.position = position;
	}

	public abstract update(deltaTimeMs: number): boolean;

	public isFinished(): boolean {
		return this.durationMs <= 0;
	}
}
