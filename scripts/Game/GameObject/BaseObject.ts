import { Animation } from '../../Animations';
import { Coordinate } from '../../Utils';
import { Model } from '../../Model';

abstract class BaseObject {
	public readonly ID: string;
	public readonly model: Model;
	public position: Coordinate;
	private animation?: Animation;

	public constructor(ID: string, position: Coordinate, model: Model) {
		this.ID = ID;
		this.position = position;
		this.model = model;
	}

	public canRender(): boolean {
		return !!this.model;
	}

	public render(gl: WebGLRenderingContext): void {
		if (!this.model) return;
		else this.model.render(gl, this.position, this.animation);
	}

	public updateAnimation(deltaTime: number): boolean {
		if (!this.animation) return true;

		const finished = this.animation.update(deltaTime);
		if (finished) this.animation = undefined;

		return finished;
	}

	public setAnimation(animation: Animation): void {
		this.animation = animation;
	}
}

export default BaseObject;
