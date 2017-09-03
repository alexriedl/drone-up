import { Animation, ObjectType } from './Enums';

export interface ICoords {
	x: number;
	y: number;
}

export interface IMoveInfo {
	ID: string;
	type: ObjectType;
	startPos: ICoords;
	endPos: ICoords;
	curPos: ICoords;
	animation: Animation;
	durationMs: number;
}
