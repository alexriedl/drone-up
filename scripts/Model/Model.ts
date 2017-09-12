import { Animation } from '../Animations';
import { Coordinate } from '../Utils';
import { Shader } from './Shader';

abstract class Model {
	protected shader: Shader;

	public useShader(gl: WebGLRenderingContext): void {
		this.shader.use(gl);
	}

	public abstract getModelViewMatrixUniformLocation(): WebGLUniformLocation;
	public abstract render(gl: WebGLRenderingContext, position: Coordinate, animation?: Animation): void;
}

export default Model;
