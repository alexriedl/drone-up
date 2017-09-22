import { Animation, ResizeAnimation, MoveAnimation } from '../../Animations';
import { Model } from '../../Model';
import { vec3, mat4 } from '../../Math';

export default class BaseObject {
	public readonly model: Model;
	// TODO: This should not be public
	public position: vec3;
	protected scale: vec3;

	private animation?: Animation;

	private parent?: BaseObject;
	private children?: BaseObject[] = [];

	public constructor(model: Model, position: vec3 = new vec3(), scale: vec3 = new vec3(1, 1, 1)) {
		this.position = position;
		this.scale = scale;
		this.model = model;
	}

	public setParent(parent: BaseObject): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}

		if (parent) {
			this.parent.children.push(this);
		}

		this.parent = parent;
	}

	protected removeChild(child: BaseObject): void {
		if (!child) return;
		const index = this.children.indexOf(child);
		if (index >= 0) {
			this.children.splice(index, 1);
		}
	}

	public canRender(): boolean {
		// TODO: Improve this to ensure buffer and shader is also loaded
		// TODO: Check if any child can render
		return !!this.model;
	}

	public render(gl: WebGLRenderingContext, vpMatrix: mat4, overridePosition?: vec3, overrideScale?: vec3): void {
		if (!this.model) return;

		const scale = overrideScale || this.getScale();
		const position = overridePosition || this.getPosition();

		// TODO: The 0.5 is the built in size of the object. Find a clean way to build that into the offset
		const offset = new vec3(0.5 - scale.x / 2, 0.5 - scale.y / 2, 0);
		const modelMatrix = mat4.fromTranslation(position.add(offset)).scale(scale);
		const mvpMatrix = modelMatrix.mul(vpMatrix);

		this.model.render(gl, mvpMatrix);
	}

	public update(deltaTime: number): boolean {
		let childrenDone = true;
		for (const child of this.children) {
			const childDone = child.update(deltaTime);
			if (!childDone) childrenDone = false;
		}

		if (!this.animation) return childrenDone;

		const myAnimationDone = this.animation.update(deltaTime);
		if (myAnimationDone) this.animation = undefined;

		return myAnimationDone && childrenDone;
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
				return new vec3(this.scale.x + bonusSize, this.scale.y + bonusSize, this.scale.z);
			}
		}

		return this.scale;
	}
}
