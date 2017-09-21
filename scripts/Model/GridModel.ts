import { Color } from '../Utils';
import { GridShader } from './Shader';
import { vec3, mat4 } from '../Math';
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

	protected calculateState(vpMatrix: mat4, position: vec3, scale: vec3): IRenderState {
		const offset = new vec3(-scale.x / 2, -scale.y / 2, 0);
		const modelMatrix = mat4.fromTranslation(position.add(offset)).scale(scale);
		// const mvpMatrix = modelMatrix.mul(vpMatrix);
		// const mvpMatrix = vpMatrix.mul(modelMatrix);

		return { modelMatrix, orthoMatrix: vpMatrix };
	}

	protected updateUniforms(gl: WebGLRenderingContext, renderState: IRenderState): void {
		const shader = this.shader;
		super.updateUniforms(gl, renderState);

		gl.uniform1f(shader.uniformGridThicknessLocation, this.gridThickness);
		gl.uniform1f(shader.uniformXCountLocation, this.xSize);
		gl.uniform1f(shader.uniformYCountLocation, this.ySize);
	}
}
