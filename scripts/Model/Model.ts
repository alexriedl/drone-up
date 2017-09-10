import { Animation } from '../Animations';
import { Coordinate } from '../Utils';
import { Shader } from '../Shader';
import Renderer from '../Renderer';

abstract class Model {
	protected shader: Shader;

	public constructor() {
	}

	public renderAnimation(renderer: Renderer, animation: Animation): void {
		this.renderModel(renderer, animation.position, animation);
	}

	public render(renderer: Renderer, position: Coordinate): void {
		this.renderModel(renderer, position);
	}

	public useShader(): void {
		this.shader.use();
	}

	public abstract getModelViewMatrixUniformLocation(): WebGLUniformLocation;
	protected abstract renderModel(renderer: Renderer, position: Coordinate, animation?: Animation): void;
}

export default Model;
