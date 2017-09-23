import { Model } from '../../Engine/Model';
import { vec3 } from '../../Engine/Math';
import GameObject from './GameObject';

export default class Spike extends GameObject {
	public constructor(model: Model, position: vec3, scale?: vec3) {
		super(model, position, scale);
	}
}
