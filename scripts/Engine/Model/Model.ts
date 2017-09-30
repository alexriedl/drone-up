import { Buffer } from 'Engine/Model/Buffer';
import { mat4 } from 'Engine/Math';
import { Shader } from 'Engine/Model/Shader';
import { Register } from 'Engine/Utils';

abstract class Model {
	protected shader: Shader;
	protected buffer: Buffer;

	public constructor() {
		Register.registerGLItem(this);
		this.shader = this.createShader();
		this.buffer = this.createVertexBuffer();
	}

	public useShader(gl: WebGLRenderingContext): void {
		this.shader.use(gl);
	}

	public render(gl: WebGLRenderingContext, mvpMatrix: mat4): void {
		this.updateAttributes(gl);
		this.updateUniforms(gl, mvpMatrix);
		this.draw(gl);
	}

	public initialize(gl: WebGLRenderingContext): void {
		return;
	}

	protected abstract createShader(): Shader;
	protected abstract createVertexBuffer(): Buffer;
	protected abstract updateAttributes(gl: WebGLRenderingContext): void;
	protected abstract updateUniforms(gl: WebGLRenderingContext, mvpMatrix: mat4): void;
	protected abstract draw(gl: WebGLRenderingContext): void;
}

export default Model;
