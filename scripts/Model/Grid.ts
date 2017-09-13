import { Animation } from '../Animations';
import { Coordinate, Color } from '../Utils';
import { GridShader } from './Shader';
import { RectangleBuffer } from './Buffer';
import SimpleRectangle, { IRenderState } from './SimpleRectangle';

export default class Grid extends SimpleRectangle {
	protected buffer: RectangleBuffer;
	protected shader: GridShader;
	protected gridThickness: number;
	protected xSize: number;
	protected ySize: number;

	public constructor(gridColor: Color, gridThickness: number, xSize: number, ySize: number) {
		super(gridColor);

		this.gridThickness = gridThickness;
		this.xSize = xSize;
		this.ySize = ySize;
	}

	protected createShader(): GridShader {
		return GridShader.createShader();
	}

	public getModelViewMatrixUniformLocation(): WebGLUniformLocation {
		return this.shader.uniformProjectionMatrixLocation;
	}

	protected setupRenderState(position?: Coordinate, animation?: Animation): IRenderState {
		return {
			...super.setupRenderState(position, animation),
			size: new TSM.vec3([this.xSize, this.ySize, 1]),
		};
	}

	protected updateUniforms(gl: WebGLRenderingContext, renderState: IRenderState): void {
		const shader = this.shader;
		const size = renderState.size;
		const position = renderState.position;

		const modelViewMatrix = TSM.mat4.identity
			.copy()
			.translate(position.vec3())
			.scale(size);

		gl.uniformMatrix4fv(shader.uniformModelViewMatrixLocation, false, new Float32Array(modelViewMatrix.all()));
		gl.uniform4fv(shader.uniformColorLocation, new Float32Array(this.color.all()));
		gl.uniform1f(shader.uniformGridThicknessLocation, this.gridThickness);
		gl.uniform1f(shader.uniformXCountLocation, this.xSize);
		gl.uniform1f(shader.uniformYCountLocation, this.ySize);
	}
}
