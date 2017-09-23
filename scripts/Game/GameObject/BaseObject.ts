import { Animation, ResizeAnimation, MoveAnimation } from '../../Animations';
import { Model } from '../../Model';
import { vec3, mat4 } from '../../Math';

export default class BaseObject {
	private readonly model: Model;

	private animation?: Animation;
	private removeAtEndOfAnimation: boolean = false;

	private position: vec3;
	private scale: vec3;

	private parent?: BaseObject;
	private readonly children?: BaseObject[] = [];

	public constructor(model: Model, position: vec3 = new vec3(), scale: vec3 = new vec3(1, 1, 1)) {
		this.position = position;
		this.scale = scale;
		this.model = model;
	}

	public setParent(parent: BaseObject): void {
		if (this.parent) {
			const index = this.parent.children.indexOf(this);
			if (index >= 0) {
				this.parent.children.splice(index, 1);
			}
		}

		if (parent) {
			parent.children.push(this);
		}

		this.parent = parent;
	}

	public render(gl: WebGLRenderingContext, vpMatrix: mat4, overridePosition?: vec3, overrideScale?: vec3): void {
		const scale = overrideScale || this.getScale();
		const position = overridePosition || this.getPosition();

		// TODO: The 0.5 is the built in size of the object. Find a clean way to build that into the offset
		const offset = new vec3(0.5 - scale.x / 2, 0.5 - scale.y / 2, 0);
		const modelMatrix = mat4.fromTranslation(position.add(offset)).scale(scale);
		const mvpMatrix = modelMatrix.mul(vpMatrix);

		if (this.model) {
			this.model.useShader(gl);
			this.model.render(gl, mvpMatrix);
		}

		this.children.forEach((c) => {
			c.render(gl, mvpMatrix);
		});
	}

	public update(deltaTime: number): boolean {
		let childrenAnimating = false;
		for (const child of this.children) {
			const childAnimating = child.update(deltaTime);
			if (childAnimating) childrenAnimating = true;
		}

		if (!this.animation) return childrenAnimating;

		const stillAnimating = this.animation.update(deltaTime);
		if (!stillAnimating) {
			this.animation = undefined;
			if (this.removeAtEndOfAnimation) this.setParent(undefined);
		}

		return stillAnimating || childrenAnimating;
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
