import { Buffer } from 'Engine/Model/Buffer';
import { mat4 } from 'Engine/Math';
import { Shader } from 'Engine/Model/Shader';

abstract class Model {
	protected shader: Shader;
	protected buffer: Buffer;

	public constructor() {
		this.shader = this.createShader();
		this.buffer = this.createBuffer();
	}

	public useShader(gl: WebGLRenderingContext): void {
		this.shader.use(gl);
	}

	public render(gl: WebGLRenderingContext, mvpMatrix: mat4): void {
		this.updateAttributes(gl);
		this.updateUniforms(gl, mvpMatrix);
		this.draw(gl);
	}

	protected abstract createShader(): Shader;
	protected abstract createBuffer(): Buffer;
	protected abstract updateAttributes(gl: WebGLRenderingContext): void;
	protected abstract updateUniforms(gl: WebGLRenderingContext, mvpMatrix: mat4): void;
	protected abstract draw(gl: WebGLRenderingContext): void;
}

export default Model;
