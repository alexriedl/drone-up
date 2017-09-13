import { Animation } from '../Animations';
import { Coordinate } from '../Utils';
import { Shader } from './Shader';
import { Buffer } from './Buffer';

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

	public abstract getModelViewMatrixUniformLocation(): WebGLUniformLocation;

	public render(gl: WebGLRenderingContext, position?: Coordinate, animation?: Animation): void {
		const state = this.setupRenderState(position, animation);
		this.updateAttributes(gl, state);
		this.updateUniforms(gl, state);
		this.draw(gl, state);
	}

	protected abstract createShader(): Shader;
	protected abstract createBuffer(): Buffer;
	protected abstract setupRenderState(position?: Coordinate, animation?: Animation): any;
	protected abstract updateAttributes(gl: WebGLRenderingContext, renderState: any): void;
	protected abstract updateUniforms(gl: WebGLRenderingContext, renderState: any): void;
	protected abstract draw(gl: WebGLRenderingContext, renderState: any): void;
}

export default Model;
