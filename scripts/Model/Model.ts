import { Animation } from '../Animations';
import { Coordinate } from '../Utils';
import { Register } from '../Utils';
import { Shader } from './Shader';

abstract class Model {
	protected shader: Shader;

	public renderAnimation(gl: WebGLRenderingContext, animation: Animation): void {
		this.renderModel(gl, animation.position, animation);
	}

	public render(gl: WebGLRenderingContext, position: Coordinate = new Coordinate(0, 0)): void {
		this.renderModel(gl, position);
	}

	public useShader(gl: WebGLRenderingContext): void {
		this.shader.use(gl);
	}

	public abstract getModelViewMatrixUniformLocation(): WebGLUniformLocation;
	protected abstract renderModel(gl: WebGLRenderingContext, position: Coordinate, animation?: Animation): void;
}

export default Model;
