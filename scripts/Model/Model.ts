import { Buffer } from './Buffer';
import { Shader } from './Shader';
import { vec3, mat4 } from '../Math';

abstract class Model<Tstate = any> {
	protected shader: Shader;
	protected buffer: Buffer;

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

	public render(gl: WebGLRenderingContext, vpMatrix: mat4, position: vec3, scale: vec3): void {
		const state = this.calculateState(vpMatrix, position, scale);

		this.updateAttributes(gl, state);
		this.updateUniforms(gl, state);
		this.draw(gl, state);
	}

	protected abstract createShader(): Shader;
	protected abstract createBuffer(): Buffer;
	protected abstract calculateState(vpMatrix: mat4, position: vec3, scale: vec3): Tstate;
	protected abstract updateAttributes(gl: WebGLRenderingContext, renderState: Tstate): void;
	protected abstract updateUniforms(gl: WebGLRenderingContext, renderState: Tstate): void;
	protected abstract draw(gl: WebGLRenderingContext, renderState: Tstate): void;
}

export default Model;
