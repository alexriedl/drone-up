import { Animation } from '../Animations';
import { Coordinate } from '../Utils';
import { RenderGroup } from '../Renderer';

abstract class Model {
	public constructor() {
	}

	public renderAnimation(group: RenderGroup, animation: Animation): void {
		this.renderModel(group, animation.position);
	}

	public render(group: RenderGroup, position: Coordinate): void {
		this.renderModel(group, position);
	}

	protected abstract renderModel(group: RenderGroup, position: Coordinate): void;
}

export default Model;
