import { AnimationType } from './AnimationType';
import { ICoords, ObjectType } from '../Utils';
import Color from '../Utils/Color';
import RenderGroup from '../Renderer/RenderGroup';

export abstract class Animation {
	public readonly animationType: AnimationType;
	public durationMs: number;
	public readonly position: ICoords;

	public constructor(position: ICoords, animationType: AnimationType, durationMs: number) {
		this.animationType = animationType;
		this.durationMs = durationMs;
		this.position = position;
	}

	public abstract update(deltaTimeMs: number): boolean;

	public isFinished(): boolean {
		return this.durationMs <= 0;
	}
}
