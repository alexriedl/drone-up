import { Animation, ResizeAnimation, MoveAnimation } from '../../Animations';
import { Model } from '../../Model';
import { vec3, mat4 } from '../../Math';

abstract class BaseObject {
	public readonly model: Model;
	public position: vec3;
	private animation?: Animation;

	public constructor(position: vec3, model?: Model) {
		this.position = position;
		this.model = model;
	}

	public canRender(): boolean {
		// TODO: Improve this to ensure buffer and shader is also loaded
		return !!this.model;
	}

	public render(gl: WebGLRenderingContext, vpMatrix: mat4): void {
		if (!this.model) return;
		else this.model.render(gl, vpMatrix, this.getPosition(), this.getScale());
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

	public getAnimation(): Animation {
		return this.animation;
	}

	public getPosition(): vec3 {
		if (this.animation && this.animation instanceof MoveAnimation) {
			return this.animation.position;
		}

		return this.position;
	}

	public getScale(): vec3 {
		if (this.animation) {
			if (this.animation instanceof ResizeAnimation) {
				const s = this.animation.size;
				return new vec3(s, s, 1);
			}
			else if (this.animation instanceof MoveAnimation) {
				const bonusSize = this.animation.bonusSize;
				return new vec3(1 + bonusSize, 1 + bonusSize, 1);
			}
		}

		return new vec3(1, 1, 1);
	}
}

export default BaseObject;
