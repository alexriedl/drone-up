import { Color } from '../Utils';
import { GridShader } from './Shader';
import SimpleRectangle, { IRenderState } from './SimpleRectangle';

export default class GridModel extends SimpleRectangle {
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

	protected updateUniforms(gl: WebGLRenderingContext, renderState: IRenderState): void {
		const shader = this.shader;
		super.updateUniforms(gl, renderState);

		gl.uniform1f(shader.uniformGridThicknessLocation, this.gridThickness);
		gl.uniform1f(shader.uniformXCountLocation, this.xSize);
		gl.uniform1f(shader.uniformYCountLocation, this.ySize);
	}
}
