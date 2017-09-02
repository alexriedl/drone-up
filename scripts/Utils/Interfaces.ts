import { Animation } from './Enums';

export interface ICoords {
	x: number;
	y: number;
}

export interface IMoveInfo {
	ID: string;
	startPos: ICoords;
	endPos: ICoords;
	curPos: ICoords;
	animation: Animation;
}
