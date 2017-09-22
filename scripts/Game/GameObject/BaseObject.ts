import { Animation, ResizeAnimation, MoveAnimation } from '../../Animations';
import { Model } from '../../Model';
import { vec3, mat4 } from '../../Math';

export default class BaseObject {
	private readonly model: Model;

	private animation?: Animation;
	private removeAtEndOfAnimation: boolean = false;

	// TODO: This should not be public
	public position: vec3;
	protected scale: vec3;

	private parent?: BaseObject;
	private children?: BaseObject[] = [];

	public constructor(model: Model, position: vec3 = new vec3(), scale: vec3 = new vec3(1, 1, 1)) {
		this.position = position;
		this.scale = scale;
		this.model = model;
	}

	public setParent(parent: BaseObject): void {
		if (this.parent) {
			const index = this.parent.children.indexOf(this);
			if (index >= 0) {
				this.children.splice(index, 1);
			}
		}

		if (parent) {
			parent.children.push(this);
		}

		this.parent = parent;
	}

	public render(gl: WebGLRenderingContext, vpMatrix: mat4, overridePosition?: vec3, overrideScale?: vec3): void {
		if (!this.model) return;

		const scale = overrideScale || this.getScale();
		const position = overridePosition || this.getPosition();

		// TODO: The 0.5 is the built in size of the object. Find a clean way to build that into the offset
		const offset = new vec3(0.5 - scale.x / 2, 0.5 - scale.y / 2, 0);
		const modelMatrix = mat4.fromTranslation(position.add(offset)).scale(scale);
		const mvpMatrix = modelMatrix.mul(vpMatrix);

		this.model.useShader(gl);
		this.model.render(gl, mvpMatrix);

		this.children.forEach((c) => {
			c.render(gl, mvpMatrix);
		});
	}

	public update(deltaTime: number): boolean {
		let childrenDone = true;
		for (const child of this.children) {
			const childDone = child.update(deltaTime);
			if (!childDone) childrenDone = false;
		}

		if (!this.animation) return childrenDone;

		const myAnimationDone = this.animation.update(deltaTime);
		if (myAnimationDone) {
			this.animation = undefined;
			if (this.removeAtEndOfAnimation) this.setParent(undefined);
		}

		return myAnimationDone && childrenDone;
	}

	public setAnimation(animation: Animation, removeAtEndOfAnimation: boolean = false): void {
		this.animation = animation;
		this.removeAtEndOfAnimation = removeAtEndOfAnimation;
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
