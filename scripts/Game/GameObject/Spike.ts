import { Model } from '../../Model';
import { vec3 } from '../../Math';
import GameObject from './GameObject';

export default class Spike extends GameObject {
	public constructor(model: Model, position: vec3, scale?: vec3) {
		super(model, position, scale);
	}
}
