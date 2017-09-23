import { Model } from './Model';
import { vec3, mat4 } from './Math';

export default class BaseObject {
	private readonly model: Model;

	public position: vec3;
	public scale: vec3;

	private parent?: BaseObject;
	private readonly children?: BaseObject[] = [];

	public constructor(model: Model, position: vec3 = new vec3(), scale: vec3 = new vec3(1, 1, 1)) {
		this.position = position;
		this.scale = scale;
		this.model = model;
	}

	public getPosition(): vec3 {
		return this.position;
	}

	public getScale(): vec3 {
		return this.scale;
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

		return childrenAnimating;
	}
}
