import { Animation, MoveAnimation } from '../../Animations';
import { Model } from '../../Model';
import { vec2 } from '../../Math';

abstract class BaseObject {
	public readonly ID: string;
	public readonly model: Model;
	public position: vec2;
	private animation?: Animation;

	public constructor(ID: string, position: vec2, model: Model) {
		this.ID = ID;
		this.position = position;
		this.model = model;
	}

	public canRender(): boolean {
		// TODO: Improve this to ensure buffer and shader is also loaded
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

	public getPosition() {
		if (this.animation) {
			if (this.animation instanceof MoveAnimation) {
				return this.animation.position;
			}
		}

		return this.position;
	}
}

export default BaseObject;
