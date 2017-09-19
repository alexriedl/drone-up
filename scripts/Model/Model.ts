import { Animation } from '../Animations';
import { Buffer } from './Buffer';
import { Shader } from './Shader';
import { vec2, mat4 } from '../Math';

import { BaseObject } from '../Game/GameObject';

abstract class Model<Tstate = any> {
	protected shader: Shader;
	protected buffer: Buffer;
	protected owner: BaseObject;

	public constructor() {
		this.shader = this.createShader();
		this.buffer = this.createBuffer();
	}

	public useShader(gl: WebGLRenderingContext): void {
		this.shader.use(gl);
	}

	public getShader(): Shader {
		return this.shader;
	}

	public setOwner(owner: BaseObject): void {
		this.owner = owner;
	}

	public render(gl: WebGLRenderingContext, vpMatrix: mat4): void {
		const position = this.owner && this.owner.getPosition();
		const animation = this.owner && this.owner.getAnimation();
		const state = this.calculateState(vpMatrix, position, animation);

		this.updateAttributes(gl, state);
		this.updateUniforms(gl, state);
		this.draw(gl, state);
	}

	protected abstract createShader(): Shader;
	protected abstract createBuffer(): Buffer;
	protected abstract calculateState(vpMatrix: mat4, position: vec2, animation: Animation): Tstate;
	protected abstract updateAttributes(gl: WebGLRenderingContext, renderState: Tstate): void;
	protected abstract updateUniforms(gl: WebGLRenderingContext, renderState: Tstate): void;
	protected abstract draw(gl: WebGLRenderingContext, renderState: Tstate): void;
}

export default Model;
