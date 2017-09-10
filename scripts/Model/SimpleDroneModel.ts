import { Coordinate, Color } from '../Utils';
import { RenderGroup } from '../Renderer';
import Model from './Model';

export default class SimpleDroneModel extends Model {
	protected color: Color;

	public constructor(color: Color) {
		super();
		this.color = color;
	}

	protected renderModel(group: RenderGroup, position: Coordinate): void {
		const animationSize = new TSM.vec3([1, 1, 0]);
		group.pushRectangle(new TSM.vec3([position.x, position.y, 0]), animationSize, this.color);
	}
}
