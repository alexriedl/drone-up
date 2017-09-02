import { Animation } from './Enums';

export interface ICoords {
	x: number;
	y: number;
}

export interface IMoveInfo {
	startPos: ICoords;
	endPos: ICoords;
	animation: Animation;
}
