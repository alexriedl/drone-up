import { Enums } from '../../Utils';
import { Model } from '../../Model';
import { vec2 } from '../../Math';
import GameObject from './GameObject';

export default class Spike extends GameObject {
	public constructor(ID: string, model: Model, position: vec2) {
		super(ID, Enums.ObjectType.Spike, model, undefined, position);
	}
}
