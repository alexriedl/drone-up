import { Animation } from '../Animations';
import { Buffer } from './Buffer';
import { Shader } from './Shader';
import { vec2 } from '../Math';

abstract class Model {
	protected shader: Shader;
	protected buffer: Buffer;

	public constructor() {
		this.shader = this.createShader();
		this.buffer = this.createBuffer();
	}

	public useShader(gl: WebGLRenderingContext, modelViewMatrix?: Float32Array): void {
		this.shader.use(gl);
		if (modelViewMatrix) gl.uniformMatrix4fv(this.getModelViewMatrixUniformLocation(), false, modelViewMatrix);
	}

	public getShader(): Shader {
		return this.shader;
	}

	protected abstract getModelViewMatrixUniformLocation(): WebGLUniformLocation;

	public render(gl: WebGLRenderingContext, position?: vec2, animation?: Animation): void {
		const state = this.setupRenderState(position, animation);
		this.updateAttributes(gl, state);
		this.updateUniforms(gl, state);
		this.draw(gl, state);
	}

	protected abstract createShader(): Shader;
	protected abstract createBuffer(): Buffer;
	protected abstract setupRenderState(position?: vec2, animation?: Animation): any;
	protected abstract updateAttributes(gl: WebGLRenderingContext, renderState: any): void;
	protected abstract updateUniforms(gl: WebGLRenderingContext, renderState: any): void;
	protected abstract draw(gl: WebGLRenderingContext, renderState: any): void;
}

export default Model;
