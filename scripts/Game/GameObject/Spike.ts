import { Coordinate, Enums } from '../../Utils';
import { Model } from '../../Model';
import GameObject from './GameObject';

export default class Spike extends GameObject {
	public constructor(ID: string, model: Model, position: Coordinate) {
		super(ID, Enums.ObjectType.Spike, model, undefined, position);
	}
}
