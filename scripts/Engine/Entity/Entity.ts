import { Model } from 'Engine/Model';
import { vec3, mat4 } from 'Engine/Math';

export default class Entity {
	protected model: Model;

	protected parent?: Entity;
	protected readonly children?: Entity[] = [];

	public position: vec3;
	public scale: vec3;

	public constructor(model?: Model, position: vec3 = new vec3(), scale: vec3 = new vec3(1, 1, 1)) {
		this.model = model;
		this.position = position;
		this.scale = scale;
	}

	public getRenderingPosition(): vec3 {
		return this.position;
	}

	public getRenderingScale(): vec3 {
		return this.scale;
	}

	public setParent(parent: Entity): void {
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
		const scale = overrideScale || this.getRenderingScale();
		const position = overridePosition || this.getRenderingPosition();

		const modelMatrix = mat4.fromTranslation(position).scale(scale);
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
